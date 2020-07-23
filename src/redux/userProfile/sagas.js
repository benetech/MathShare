import {
    all,
    call,
    delay,
    fork,
    put,
    select,
    takeLatest,
    throttle,
} from 'redux-saga/effects';
import {
    IntercomAPI,
} from 'react-intercom';
import ReactGA from 'react-ga';
import { goBack, push, replace } from 'connected-react-router';
import * as dayjs from 'dayjs';
import {
    fetchRecentWork,
    markUserResolved,
    resetUserProfile,
    setUserProfile,
    setAuthRedirect,
    setMobileNotifySuccess,
    setPersonalizationSettings,
    setRecentWork,
    setUserInfo,
} from './actions';
import {
    getState,
} from './selectors';
import {
    fetchCurrentUserApi,
    fetchUserInfoApi,
    fetchRecentWorkApi,
    getConfigApi,
    logoutApi,
    saveUserInfoApi,
    setConfigApi,
    updateNotifyMobileApi,
} from './apis';
import {
    alertError, alertInfo, alertSuccess, dismissAlert, focusOnAlert,
} from '../../scripts/alert';
import { getCookie } from '../../scripts/cookie';
import Locales from '../../strings';
import { sessionStore } from '../../scripts/storage';
import { waitForIntercomToBoot } from '../../services/intercom';
import { getFormattedUserType } from '../../services/mathshare';

const loginAlertId = 'login-alert';
const redirectAlertId = 'redirect-info';
const redirectWait = 2500;


function* checkUserLoginSaga() {
    yield throttle(60000, 'CHECK_USER_LOGIN', function* workerSaga() {
        yield put({
            type: 'CHECK_USER_LOGIN_START',
        });
        let loginStarted = false;
        try {
            if (!loginStarted) {
                const cookie = getCookie('sid');
                const stringifiedUser = Buffer.from(cookie, 'base64').toString('utf8');
                if (stringifiedUser) {
                    const session = JSON.parse(stringifiedUser);
                    loginStarted = session.loginStarted;
                }
            }
            const response = yield call(fetchCurrentUserApi);
            if (response.status !== 200) {
                throw Error('Unable to login');
            }
            const {
                emails,
                displayName,
                imageUrl,
            } = response.data;
            if (loginStarted) {
                alertSuccess(Locales.strings.you_are_signed_in.replace('{user}', displayName), Locales.strings.success, loginAlertId);
                focusOnAlert(loginAlertId);
            }
            try {
                const userInfoResponse = yield call(fetchUserInfoApi, emails[0]);
                if (userInfoResponse.status !== 200) {
                    throw Error('User info not set');
                } else {
                    const userInfo = userInfoResponse.data;
                    yield put(setUserProfile(emails[0], displayName, imageUrl || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=256&name=${encodeURIComponent(displayName)}&rounded=true&length=1`, 'passport', userInfo.userType));
                    yield put(setUserInfo(userInfo));
                }
            } catch (infoError) {
                yield put(setUserProfile(emails[0], displayName, imageUrl || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=256&name=${encodeURIComponent(displayName)}&rounded=true&length=1`, 'passport', null));
                yield put(markUserResolved(true));
                yield put(setAuthRedirect((window.location.hash || '').substring(1)));
                if (window.location.hash !== '#/userDetails') {
                    alertInfo(
                        Locales.strings.redirecting_to_fill, Locales.strings.info,
                        redirectAlertId,
                    );
                    yield delay(redirectWait);
                    yield put(push('/userDetails'));
                    dismissAlert(redirectAlertId);
                }
            } finally {
                try {
                    yield put(fetchRecentWork());
                    const configResponse = yield call(getConfigApi);
                    if (configResponse.status === 200) {
                        const {
                            data,
                        } = configResponse;
                        yield put(setPersonalizationSettings(data));
                    }
                } catch (configError) {
                    // eslint-disable-next-line no-console
                    console.log('configError', configError);
                }
            }
        } catch (error) {
            yield put(resetUserProfile());
            yield put({
                type: 'CHECK_USER_LOGIN_ERROR',
                error,
            });
            if (loginStarted) {
                alertError(
                    Locales.strings.login_something_wrong,
                    Locales.strings.failure,
                    loginAlertId,
                    {
                        link: '/#/app',
                        text: Locales.strings.return_to_mathshare,
                    },
                );
                focusOnAlert(loginAlertId);
            }
        } finally {
            yield put({
                type: 'CHECK_USER_LOGIN_COMPLETE',
            });
        }
    });
}

function* fetchRecentWorkSaga() {
    yield takeLatest('FETCH_RECENT_WORK', function* workerSaga() {
        try {
            const {
                info,
            } = yield select(getState);
            const response = yield call(fetchRecentWorkApi(info.userType), {});
            if (response.status !== 200) {
                throw Error('Unable to fetch work');
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
        const {
            email,
            redirectTo,
        } = yield select(getState);
        try {
            const {
                userType,
            } = payload;
            const userInfoResponse = yield call(saveUserInfoApi, {
                ...payload,
                user_type: userType,
                email,
            });
            yield put(setUserInfo(userInfoResponse.data));
        } catch (error) {
            yield put({
                type: 'SAVE_USER_INFO_FAILURE',
            });
        } finally {
            yield put(replace(redirectTo));
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
        } = payload;
        ReactGA.set({
            email,
        });
    });
}

function* setMobileNotifySaga() {
    yield takeLatest('SET_MOBILE_NOTIFY', function* workerSaga({
        payload,
    }) {
        try {
            const {
                notifyForMobile,
                inputEmail,
            } = payload;
            const {
                email,
            } = yield select(getState);
            if (email) {
                yield call(updateNotifyMobileApi, notifyForMobile);
            }
            if (notifyForMobile === 1 && (yield call(waitForIntercomToBoot, 5))) {
                IntercomAPI('trackEvent', 'notify-mobile-support', {
                    email: email || inputEmail,
                });
            }
            yield put(setMobileNotifySuccess(notifyForMobile));
            sessionStore.setItem('hide_mobile_support_banner', dayjs().add(1, 'hour').toISOString());
            alertSuccess(Locales.strings.thanks_for_mobile_notfiy, Locales.strings.success);
        } catch (error) {
            yield put({
                type: 'SET_MOBILE_NOTIFY_FAILURE',
                error,
            });
        }
    });
}

function* savePersonalizationSettingsSaga() {
    yield takeLatest('SAVE_PERSONALIZATION_SETTINGS', function* workerSaga({
        payload,
    }) {
        try {
            const {
                email,
            } = yield select(getState);
            if (email) {
                const response = yield call(setConfigApi, payload);
                if (response.status !== 200) {
                    throw Error('Unable to update config');
                }
                const {
                    data,
                } = response;
                yield put(setPersonalizationSettings(data));
                alertSuccess(
                    Locales.strings.personalization_config_has_been_updated,
                    Locales.strings.success,
                );
            }
        } catch (error) {
            yield put({
                type: 'SAVE_PERSONALIZATION_SETTINGS_FAILURE',
                error,
            });
        }
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
            alertSuccess(
                Locales.strings.you_have_been_logged_out, Locales.strings.success, loginAlertId,
            );
            focusOnAlert(loginAlertId);
            if (yield call(waitForIntercomToBoot, 5)) {
                IntercomAPI('shutdown');
                IntercomAPI('boot', {
                    app_id: process.env.INTERCOM_APP_ID,
                });
            }
        } catch (error) {
            yield put({
                type: 'LOGOUT_FAILURE',
            });
        }
    });
}

function* setUserInfoSaga() {
    yield takeLatest('SET_USER_INFO', function* workerSaga({
        payload,
    }) {
        yield put(setMobileNotifySuccess(payload.notifyForMobile));
        ReactGA.set({ UserType: getFormattedUserType(payload.userType) });
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
        fork(setMobileNotifySaga),
        fork(savePersonalizationSettingsSaga),
        fork(setUserInfoSaga),
    ]);
}
