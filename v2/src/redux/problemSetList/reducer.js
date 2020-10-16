/* eslint-disable no-unused-vars */
const initialState = {
    exampleProblemSets: {
        data: [],
        loading: false,
    },
    recentProblemSets: {
        data: [],
        loading: false,
    },
    recentSolutionSets: {
        data: [],
        loading: false,
    },
};

const problems = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'REQUEST_EXAMPLE_SETS':
        return {
            ...state,
            exampleProblemSets: {
                ...state.exampleProblemSets,
                loading: true,
            },
        };
    case 'REQUEST_EXAMPLE_SETS_SUCCESS':
        return {
            ...state,
            ...payload,
        };
    case 'REQUEST_RECENT_SETS':
        return {
            ...state,
            recentProblemSets: {
                ...state.recentProblemSets,
                loading: true,
            },
            recentSolutionSets: {
                ...state.recentProblemSets,
                loading: true,
            },
        };
    case 'REQUEST_RECENT_SOLUTION_SETS_SUCCESS':
    case 'REQUEST_RECENT_PROBLEM_SETS_SUCCESS':
        return {
            ...state,
            ...payload,
        };
    case 'REQUEST_RECENT_SETS_SUCCESS':
        return {
            ...state,
            ...payload,
        };
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
            recentSolutionSets: {
                ...state.recentSolutionSets,
                data: state.recentSolutionSets.data.filter(set => set.editCode !== editCode),
            },
        };
    }
    default:
        return state;
    }
};

export default problems;
