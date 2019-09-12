import {
    all,
    call,
    delay,
    fork,
    put,
    select,
    takeLatest,
} from 'redux-saga/effects';
import {
    UserAgentApplication,
} from 'msal';
import {
    IntercomAPI,
} from 'react-intercom';
import ReactGA from 'react-ga';
import {
    goBack,
    replace,
} from 'connected-react-router';
import {
    handleSuccessfulLogin,
    redirectAfterLogin,
    resetUserProfile,
    setAuthRedirect,
    setUserProfile,
} from './actions';
import {
    fetchUserInfoApi,
    saveUserInfoApi,
} from './apis';
import msalConfig from '../../constants/msal';
import {
    getState,
} from './selectors';

function* checkMsLoginSaga() {
    yield takeLatest('CHECK_MS_LOGIN', function* workerSaga({
        payload: {
            redirect,
        },
    }) {
        const myMSALObj = new UserAgentApplication(msalConfig);
        const microsoftAccount = myMSALObj.getAccount();
        if (microsoftAccount) {
            const {
                name,
                userName,
            } = microsoftAccount;
            const profileImage = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=256&name=${encodeURIComponent(name)}&rounded=true&length=1`;
            yield put(setUserProfile(
                userName, name, profileImage, 'ms',
            ));
            yield put(handleSuccessfulLogin(userName, redirect));
        }
    });
}

function* checkGoogleLoginSaga() {
    yield takeLatest('CHECK_GOOGLE_LOGIN', function* workerSaga({
        payload: {
            redirect,
        },
    }) {
        while (!window.gapi || !window.gapi.auth2 || !window.auth2Initialized) {
            yield delay(100);
        }
        const authInstance = window.gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();
        if (user && user.isSignedIn() && user.getBasicProfile()) {
            const profile = user.getBasicProfile();
            if (profile) {
                const email = profile.getEmail();
                const name = profile.getName();
                yield put(setUserProfile(email, name, profile.getImageUrl(), 'google'));
                yield put(handleSuccessfulLogin(email, redirect));
            }
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

function* handleSuccessfulLoginSaga() {
    yield takeLatest('HANDLE_SUCCESSFUL_LOGIN', function* workerSaga({
        payload: {
            email,
            redirect,
        },
    }) {
        const {
            redirectTo,
        } = yield select(getState);
        if (redirect && !redirectTo) {
            yield put(setAuthRedirect('app'));
        }
        try {
            const response = yield call(fetchUserInfoApi, email);
            if (response.status !== 200) {
                yield put(replace('/userDetails'));
            } else {
                yield put(redirectAfterLogin());
            }
        } catch (error) {
            yield put(replace('/userDetails'));
        }
    });
}

function* saveUserInfoSaga() {
    yield takeLatest('SAVE_USER_INFO', function* workerSaga({
        payload,
    }) {
        try {
            const {
                email,
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
        } catch (error) {
            console.log('Error', error);
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
        const userProfile = yield select(getState);
        const {
            service,
        } = userProfile;
        if (!service) {
            return;
        }
        if (service === 'google') {
            const authInstance = window.gapi.auth2.getAuthInstance();
            yield call(authInstance.signOut);
        }
        yield put(resetUserProfile());
        IntercomAPI('shutdown');
        IntercomAPI('boot', {
            app_id: process.env.INTERCOM_APP_ID,
        });
        if (service === 'ms') {
            const myMSALObj = new UserAgentApplication(msalConfig);
            myMSALObj.logout();
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(checkMsLoginSaga),
        fork(checkGoogleLoginSaga),
        fork(redirectAfterLoginSaga),
        fork(handleSuccessfulLoginSaga),
        fork(saveUserInfoSaga),
        fork(setUserProfileSaga),
        fork(logoutSaga),
    ]);
}
