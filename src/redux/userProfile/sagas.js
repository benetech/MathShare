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
    resetUserProfile,
    setAuthRedirect,
    setUserProfile,
} from './actions';
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
            if (redirect) {
                yield put(goBack());
            }
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
                if (redirect) {
                    const {
                        redirectTo,
                    } = yield select(getState);
                    if (redirectTo === 'app') {
                        yield put(replace('/app'));
                    } else {
                        yield put(goBack());
                    }
                }
                yield put(setAuthRedirect(null));
            }
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
        fork(setUserProfileSaga),
        fork(logoutSaga),
    ]);
}
