/* eslint-disable no-unused-vars */
const initialState = {
    revisionCode: null,
    defaultRevisionCode: null,
    exampleProblemSets: [],
    set: {
        problems: [],
        editCode: null,
        shareCode: null,
        title: '',
    },
    notFound: false,
    problemToEditIndex: null,
    problemToDeleteIndex: null,
    allowedPalettes: [],
    theActiveMathField: null,
    tempPalettes: [],
    tempProblems: [],
    newSetSharecode: '',
    problemSetShareCode: '',
};

const problems = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'REQUEST_DEFAULT_REVISION_SUCCESS':
        return {
            ...state,
            defaultRevisionCode: payload.revisionCode,
        };
    case 'REQUEST_EXAMPLE_SETS_SUCCESS':
        return {
            ...state,
            exampleProblemSets: payload.exampleProblemSets,
        };
    case 'RESET_PROBLEM_SET':
    case 'REQUEST_PROBLEM_SET':
        return {
            ...state,
            set: initialState.set,
        };
    case 'REQUEST_PROBLEM_SET_SUCCESS':
    case 'REQUEST_SAVE_PROBLEMS_SUCCESS':
        return {
            ...state,
            set: payload,
        };
    case 'ADD_PROBLEM':
        return {
            ...state,
            set: {
                ...state.set,
                problems: [
                    ...state.set.problems,
                    payload.problem,
                ],
            },
        };
    case 'UPDATE_PROBLEM_LIST':
        return {
            ...state,
            set: {
                ...state.set,
                problems: payload.problemList,
            },
        };
    case 'ADD_TEMP_PROBLEM':
        return {
            ...state,
            tempProblems: [
                ...state.tempProblems,
                payload.problem,
            ],
        };
    case 'SET_ACTIVE_MATH_FIELD_IN_PROBLEM':
    case 'SET_ACTIVE_MATH_FIELD':
        return {
            ...state,
            theActiveMathField: payload.field,
        };
    case 'SET_PROBLEM_SET_SHARE_CODE':
        return {
            ...state,
            problemSetShareCode: payload.problemSetShareCode,
        };
    case 'REQUEST_SAVE_PROBLEM_SET_SUCCESS':
        return {
            ...state,
            tempProblems: [],
            newSetSharecode: payload.shareCode,
        };
    case 'RESET_TEMP_PROBLEMS':
        return {
            ...state,
            tempProblems: [],
        };
    case 'SET_PROBLEM_DELETE_INDEX':
        return {
            ...state,
            problemToDeleteIndex: payload.problemToDeleteIndex,
        };
    case 'SET_EDIT_PROBLEM':
        return {
            ...state,
            problemToEditIndex: payload.problemToEditIndex,
            problemToEdit: {
                ...state.set.problems[payload.problemToEditIndex],
            },
        };
    case 'SET_TEMP_PALETTE':
        return {
            ...state,
            tempPalettes: payload.palettes,
        };
    default:
        return state;
    }
};

export default problems;
