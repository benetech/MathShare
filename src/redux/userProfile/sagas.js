import {
    all,
    call,
    fork,
    put,
    takeLatest,
} from 'redux-saga/effects';
import {
    IntercomAPI,
} from 'react-intercom';
import ReactGA from 'react-ga';
import {
    resetUserProfile,
    setUserProfile,
} from './actions';
import {
    fetchCurrentUserApi,
    logoutApi,
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
        } catch (error) {
            yield put(resetUserProfile());
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
        fork(setUserProfileSaga),
        fork(logoutSaga),
    ]);
}
