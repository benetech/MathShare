/* eslint-disable no-unused-vars */
const initialState = {
    exampleProblemSets: {
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
    default:
        return state;
    }
};

export default problems;
