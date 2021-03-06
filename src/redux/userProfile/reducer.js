const initialState = {
    email: '',
    name: '',
    profileImage: '',
    redirectTo: null,
    mode: null,
    service: null,
    recentProblemSets: {
        data: [],
        loading: false,
        showLoadMore: false,
    },
    recentSolutionSets: {
        data: [],
        loading: false,
        showLoadMore: false,
    },
    notifyForMobile: null,
    checking: true,
    config: null,
    info: {},
};

const userProfile = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'CHECK_USER_LOGIN_START':
        return {
            ...state,
            checking: true,
        };
    case 'UPDATE_USER_PROFILE':
        return {
            ...state,
            ...payload,
        };
    case 'MARK_USER_RESOLVED':
        return {
            ...state,
            checking: !payload.resolved,
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
            recentProblemSets: initialState.recentProblemSets,
            recentSolutionSets: initialState.recentSolutionSets,
        };
    case 'REQUEST_RECENT_SETS': {
        if (payload.type === 'recentProblemSets') {
            return {
                ...state,
                recentProblemSets: {
                    ...state.recentProblemSets,
                    loading: true,
                    showLoadMore: false,
                },
            };
        }
        return {
            ...state,
            recentSolutionSets: {
                ...state.recentSolutionSets,
                loading: true,
                showLoadMore: false,
            },
        };
    }
    case 'REQUEST_RECENT_SETS_FAILURE': {
        if (payload.type === 'recentProblemSets') {
            return {
                ...state,
                recentProblemSets: {
                    ...state.recentProblemSets,
                    loading: false,
                },
            };
        }
        return {
            ...state,
            recentSolutionSets: {
                ...state.recentSolutionSets,
                loading: false,
            },
        };
    }
    case 'REQUEST_RECENT_SETS_SUCCESS':
        return {
            ...state,
            ...payload,
        };
    case 'SET_RECENT_PROBLEM_SETS': {
        const { recentProblemSets } = payload;
        return {
            ...state,
            recentProblemSets,
        };
    }
    case 'SET_RECENT_SOLUTION_SETS': {
        const { recentSolutionSets } = payload;
        return {
            ...state,
            recentSolutionSets,
        };
    }
    case 'ARCHIVE_PROBLEM_SET_SUCCESS': {
        const { editCode, key } = payload;
        if (key !== 'recentProblemSets') {
            return state;
        }
        return {
            ...state,
            recentProblemSets: {
                ...state.recentProblemSets,
                data: state.recentProblemSets.data.filter(set => set.editCode !== editCode),
            },
        };
    }
    case 'ARCHIVE_SOLUTION_SET_SUCCESS': {
        const { editCode, key } = payload;
        if (key !== 'recentSolutionSets') {
            return state;
        }
        return {
            ...state,
            recentSolutionSets: {
                ...state.recentSolutionSets,
                data: state.recentSolutionSets.data.filter(set => set.editCode !== editCode),
            },
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
        if (payload && payload.ui) {
            window.alertAutoClose = payload.ui.alertAutoClose;
        }
        return {
            ...state,
            config: payload,
        };
    case 'SET_USER_INFO':
        return {
            ...state,
            info: payload,
            checking: false,
        };
    default:
        return state;
    }
};

export default userProfile;
