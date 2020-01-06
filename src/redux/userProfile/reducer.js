const initialState = {
    email: '',
    name: '',
    profileImage: '',
    redirectTo: null,
    mode: null,
    service: null,
    recentProblemSets: null,
    notifyForMobile: null,
    checking: false,
    config: null,
};

const userProfile = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'CHECK_USER_LOGIN':
        return {
            ...state,
            checking: true,
        };
    case 'UPDATE_USER_PROFILE':
        return {
            ...state,
            ...payload,
            checking: false,
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
            checking: false,
        };
    case 'FETCH_RECENT_WORK':
        return {
            ...state,
            recentProblemSets: null,
        };
    case 'SET_RECENT_WORK': {
        const { recentProblemSets } = payload;
        return {
            ...state,
            recentProblemSets,
        };
    }
    case 'ARCHIVE_PROBLEM_SET_SUCCESS': {
        const { editCode } = payload;
        return {
            ...state,
            recentProblemSets: state.recentProblemSets.filter(set => set.editCode !== editCode),
        };
    }
    case 'SET_MOBILE_NOTIFY_SUCCESS': {
        const { notifyForMobile } = payload;
        return {
            ...state,
            notifyForMobile,
        };
    }
    case 'SET_PERSONALIZATION_SETTINGS':
        return {
            ...state,
            config: payload,
        };
    default:
        return state;
    }
};

export default userProfile;
