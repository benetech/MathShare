const initialState = {
    email: '',
    name: '',
    profileImage: '',
    redirectTo: null,
    mode: null,
    service: null,
};

const userProfile = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'UPDATE_USER_PROFILE':
        return {
            ...state,
            ...payload,
        };
    case 'SET_AUTH_REDIRECT':
        return {
            ...state,
            redirectTo: payload.redirectTo,
        };
    case 'RESET_USER_PROFILE':
        return {
            ...state,
            ...initialState,
        };
    default:
        return state;
    }
};

export default userProfile;
