import {
    all,
    call,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
import {
    IntercomAPI,
} from 'react-intercom';
import ReactGA from 'react-ga';
import { goBack, push, replace } from 'connected-react-router';
import {
    fetchRecentWork,
    resetUserProfile,
    setUserProfile,
    setAuthRedirect,
    setRecentWork,
} from './actions';
import {
    getState,
} from './selectors';
import {
    fetchCurrentUserApi,
    fetchUserInfoApi,
    fetchRecentWorkApi,
    logoutApi,
    saveUserInfoApi,
} from './apis';

function* checkUserLoginSaga() {
    yield takeLatest('CHECK_USER_LOGIN', function* workerSaga() {
        try {
            const response = yield call(fetchCurrentUserApi);
            if (response.status !== 200) {
                throw Error('Unable to login');
            }
            const {
                emails,
                displayName,
                imageUrl,
            } = response.data;
            yield put(setUserProfile(emails[0], displayName, imageUrl || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=256&name=${encodeURIComponent(displayName)}&rounded=true&length=1`, 'passport'));
            yield put(fetchRecentWork());
            try {
                const userInfoResponse = yield call(fetchUserInfoApi, emails[0]);
                if (userInfoResponse.status !== 200) {
                    throw Error('User info not set');
                }
            } catch (infoError) {
                yield put(setAuthRedirect((window.location.hash || '').substring(1)));
                yield put(push('/userDetails'));
            }
        } catch (error) {
            yield put(resetUserProfile());
        }
    });
}

function* fetchRecentWorkSaga() {
    yield takeLatest('FETCH_RECENT_WORK', function* workerSaga() {
        try {
            const response = yield call(fetchRecentWorkApi);
            if (response.status !== 200) {
                throw Error('Unable to fetcgh work');
            }
            const {
                data,
            } = response;
            yield put(setRecentWork(data));
        } catch (error) {
            yield put({
                type: 'FETCH_RECENT_WORK_FAILURE',
            });
        }
    });
}
function* redirectAfterLoginSaga() {
    yield takeLatest('REDIRECT_AFTER_LOGIN', function* workerSaga({
        payload: {
            forceBack,
        },
    }) {
        const {
            redirectTo,
        } = yield select(getState);
        if (redirectTo === 'back') {
            yield put(goBack());
        } else if (forceBack || redirectTo === 'app' || ['#/signin', '#/userdetails'].includes(window.location.hash.toLowerCase())) {
            yield put(replace('/app'));
        }
        yield put(setAuthRedirect(null));
    });
}

function* saveUserInfoSaga() {
    yield takeLatest('SAVE_USER_INFO', function* workerSaga({
        payload,
    }) {
        try {
            const {
                email,
                redirectTo,
            } = yield select(getState);
            const {
                userType,
                grades,
                role,
            } = payload;
            IntercomAPI('trackEvent', 'user-details', {
                userType,
                grades,
                role,
            });
            yield call(saveUserInfoApi, {
                ...payload,
                user_type: userType,
                email,
            });
            yield put(replace(redirectTo));
        } catch (error) {
            yield put({
                type: 'SAVE_USER_INFO_FAILURE',
            });
        }
    });
}

function* setUserProfileSaga() {
    yield takeLatest('SET_USER_PROFILE', function* workerSaga({
        payload,
    }) {
        yield put({
            type: 'UPDATE_USER_PROFILE',
            payload,
        });
        const {
            email,
            name,
        } = payload;
        IntercomAPI('update', {
            user_id: email,
            email,
            name,
        });
        ReactGA.set({
            email,
        });
    });
}

function* logoutSaga() {
    yield takeLatest('LOGOUT', function* workerSaga() {
        try {
            const response = yield call(logoutApi);
            if (response.status !== 200) {
                throw Error('Unable to login');
            }
            yield put(resetUserProfile());
            IntercomAPI('shutdown');
            IntercomAPI('boot', {
                app_id: process.env.INTERCOM_APP_ID,
            });
        } catch (error) {
            yield put({
                type: 'LOGOUT_FAILURE',
            });
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(checkUserLoginSaga),
        fork(fetchRecentWorkSaga),
        fork(redirectAfterLoginSaga),
        fork(saveUserInfoSaga),
        fork(setUserProfileSaga),
        fork(logoutSaga),
    ]);
}
