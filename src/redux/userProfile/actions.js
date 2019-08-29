export const setUserProfile = (email, name, profileImage, service) => ({
    type: 'SET_USER_PROFILE',
    payload: {
        email,
        name,
        profileImage,
        service,
    },
});

export const checkMsLogin = redirect => ({
    type: 'CHECK_MS_LOGIN',
    payload: {
        redirect,
    },
});

export const checkGoogleLogin = redirect => ({
    type: 'CHECK_GOOGLE_LOGIN',
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

export default {
    checkGoogleLogin,
    checkMsLogin,
    logoutOfUserProfile,
    redirectAfterLogin,
    resetUserProfile,
    saveUserInfo,
    setAuthRedirect,
    setUserProfile,
    handleSuccessfulLogin,
};
