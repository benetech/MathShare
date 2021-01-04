import {
    all,
    call,
    delay,
    fork,
    put,
    select,
    takeEvery,
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
    setRecentProblemSets,
    setRecentSolutionSets,
    setUserInfo,
} from './actions';
import {
    getState,
} from './selectors';
import {
    fetchRecentWorkApi,
    fetchCurrentUserApi,
    fetchUserInfoApi,
    getConfigApi,
    logoutApi,
    saveUserInfoApi,
    setConfigApi,
    updateNotifyMobileApi,
    fetchRecentSolutionsApi,
    fetchRecentProblemsApi,
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
const PAGINATION_SIZE = 15;


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
                    if (userInfo && userInfo.infoVersion === 1 && userInfo.userType === 'student') {
                        yield put(markUserResolved(true));
                        yield put(setAuthRedirect((window.location.hash || '').substring(1)));
                        if (window.location.hash !== '#/userDetailsEdit') {
                            alertInfo(
                                Locales.strings.redirecting_to_review, Locales.strings.info,
                                redirectAlertId,
                            );
                            yield delay(redirectWait);
                            yield put(push('/userDetailsEdit'));
                            dismissAlert(redirectAlertId);
                        }
                    }
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
                    yield put(fetchRecentWork(null, 'recentSolutionSets'));
                    yield put(fetchRecentWork(null, 'recentProblemSets'));
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
        yield put({
            type: 'FETCH_RECENT_PROBLEM_SETS',
        });
        yield put({
            type: 'FETCH_RECENT_SOLUTION_SETS',
        });
    });
}

function* fetchRecentSolutionSetsSaga() {
    yield takeLatest('FETCH_RECENT_SOLUTION_SETS', function* workerSaga() {
        try {
            const response = yield call(fetchRecentSolutionsApi, {});
            if (response.status !== 200) {
                throw Error('Unable to fetch work');
            }
            const {
                data,
            } = response;
            yield put(setRecentSolutionSets({
                data,
                loading: false,
                showLoadMore: data.length === PAGINATION_SIZE,
            }));
        } catch (error) {
            yield put({
                type: 'FETCH_RECENT_SOLUTION_SETS_FAILURE',
            });
        }
    });
}

function* fetchRecentProblemSetsSaga() {
    yield takeLatest('FETCH_RECENT_PROBLEM_SETS', function* workerSaga() {
        try {
            const response = yield call(fetchRecentProblemsApi, {});
            if (response.status !== 200) {
                throw Error('Unable to fetch work');
            }
            const {
                data,
            } = response;
            yield put(setRecentProblemSets({
                data,
                loading: false,
                showLoadMore: data.length === PAGINATION_SIZE,
            }));
        } catch (error) {
            yield put({
                type: 'FETCH_RECENT_PROBLEM_SETS_FAILURE',
            });
        }
    });
}

function* requestRecentSetsSaga() {
    yield takeEvery('REQUEST_RECENT_SETS', function* workerSaga({
        payload: {
            offset,
            type,
        },
    }) {
        try {
            const requestPayload = {
                'x-content-size': PAGINATION_SIZE,
            };
            if (offset) {
                requestPayload['x-offset'] = offset;
            }
            const res = yield call(fetchRecentWorkApi(type), requestPayload);
            const { data } = res;
            const state = yield select(getState);
            const oldData = state[type].data;
            const oldIds = oldData.map(o => o.id);
            const newData = data.filter(d => !oldIds.includes(d.id));
            yield put({
                type: 'REQUEST_RECENT_SETS_SUCCESS',
                payload: {
                    [type]: {
                        data: [
                            ...state[type].data,
                            ...newData,
                        ],
                        loading: false,
                        showLoadMore: (newData.length === PAGINATION_SIZE),
                    },
                },
            });
            if (newData.length === 0) {
                alertSuccess(Locales.strings.no_more_problem_sets, Locales.strings.info);
            }
        } catch (error) {
            alertError(Locales.strings.unable_to_load, Locales.strings.failure);
            yield put({
                type: 'REQUEST_RECENT_SETS_FAILURE',
                payload: {
                    type,
                },
                error,
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
                infoVersion: 2,
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
        fork(fetchRecentProblemSetsSaga),
        fork(fetchRecentSolutionSetsSaga),
        fork(redirectAfterLoginSaga),
        fork(saveUserInfoSaga),
        fork(setUserProfileSaga),
        fork(logoutSaga),
        fork(requestRecentSetsSaga),
        fork(setMobileNotifySaga),
        fork(savePersonalizationSettingsSaga),
        fork(setUserInfoSaga),
    ]);
}
