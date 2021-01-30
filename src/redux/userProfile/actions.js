export const setUserProfile = (email, name, profileImage, service, userType) => ({
    type: 'SET_USER_PROFILE',
    payload: {
        email,
        name,
        profileImage,
        service,
        userType,
    },
});

export const markUserResolved = resolved => ({
    type: 'MARK_USER_RESOLVED',
    payload: {
        resolved,
    },
});

export const checkUserLogin = redirect => ({
    type: 'CHECK_USER_LOGIN',
    payload: {
        redirect,
    },
});

export const logoutOfUserProfile = () => ({
    type: 'LOGOUT',
});

export const resetUserProfile = () => ({
    type: 'RESET_USER_PROFILE',
});

export const setAuthRedirect = redirectTo => ({
    type: 'SET_AUTH_REDIRECT',
    payload: {
        redirectTo,
    },
});

export const redirectAfterLogin = forceBack => ({
    type: 'REDIRECT_AFTER_LOGIN',
    payload: {
        forceBack,
    },
});

export const handleSuccessfulLogin = (email, redirect) => ({
    type: 'HANDLE_SUCCESSFUL_LOGIN',
    payload: {
        email,
        redirect,
    },
});

export const saveUserInfo = (userType, grades, role) => ({
    type: 'SAVE_USER_INFO',
    payload: {
        userType,
        grades,
        role,
    },
});

export const saveUserInfoPayload = payload => ({
    type: 'SAVE_USER_INFO',
    payload,
});

export const setRecentProblemSets = recentProblemSets => ({
    type: 'SET_RECENT_PROBLEM_SETS',
    payload: {
        recentProblemSets,
    },
});

export const setRecentSolutionSets = recentSolutionSets => ({
    type: 'SET_RECENT_SOLUTION_SETS',
    payload: {
        recentSolutionSets,
    },
});

export const setMobileNotify = (notifyForMobile, inputEmail) => ({
    type: 'SET_MOBILE_NOTIFY',
    payload: {
        inputEmail,
        notifyForMobile,
    },
});

export const setMobileNotifySuccess = notifyForMobile => ({
    type: 'SET_MOBILE_NOTIFY_SUCCESS',
    payload: {
        notifyForMobile,
    },
});

export const savePersonalizationSettings = config => ({
    type: 'SAVE_PERSONALIZATION_SETTINGS',
    payload: config,
});

export const setPersonalizationSettings = payload => ({
    type: 'SET_PERSONALIZATION_SETTINGS',
    payload,
});

export const setUserInfo = payload => ({
    type: 'SET_USER_INFO',
    payload,
});

export const fetchRecentSets = (offset, type) => ({
    type: 'REQUEST_RECENT_SETS',
    payload: {
        offset,
        type,
    },
});

export const fetchRecentWork = () => ({
    type: 'FETCH_RECENT_WORK',
});

export default {
    checkUserLogin,
    fetchRecentWork,
    fetchRecentSets,
    logoutOfUserProfile,
    redirectAfterLogin,
    resetUserProfile,
    saveUserInfo,
    saveUserInfoPayload,
    setAuthRedirect,
    setMobileNotify,
    setRecentProblemSets,
    setRecentSolutionSets,
    setUserProfile,
    handleSuccessfulLogin,
    savePersonalizationSettings,
    setPersonalizationSettings,
    setUserInfo,
    markUserResolved,
};
