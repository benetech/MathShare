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

export default {
    checkGoogleLogin,
    checkMsLogin,
    logoutOfUserProfile,
    resetUserProfile,
    setAuthRedirect,
    setUserProfile,
};
