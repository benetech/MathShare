import * as dayjs from 'dayjs';

/* eslint-disable no-unused-vars */
const initialState = {
    revisionCode: null,
    defaultRevisionCode: null,
    exampleProblemSets: [],
    archivedProblemSets: [],
    set: {
        problems: [],
        editCode: null,
        shareCode: null,
        title: '',
        source: null,
        partner: {
            canSubmit: false,
            name: null,
        },
    },
    notFound: false,
    problemToEditIndex: null,
    problemToDeleteIndex: null,
    allowedPalettes: [],
    theActiveMathField: null,
    tempPalettes: [],
    tempSet: {
        problems: [],
        title: '',
        textAreaValue: '',
        displayScratchpad: null,
    },
    newSetSharecode: '',
    newSetShareEditCode: '',
    problemSetShareCode: '',
    solutions: [],
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
    case 'REQUEST_ARCHIVED_SETS':
        return {
            ...state,
            archivedProblemSets: null,
        };
    case 'REQUEST_EXAMPLE_SETS_SUCCESS':
    case 'REQUEST_ARCHIVED_SETS_SUCCESS':
        return {
            ...state,
            ...payload,
        };
    case 'ARCHIVE_PROBLEM_SET_SUCCESS': {
        const { editCode, key } = payload;
        if (key !== 'archivedProblemSets') {
            return state;
        }
        return {
            ...state,
            archivedProblemSets: state.archivedProblemSets.filter(set => set.editCode !== editCode),
        };
    }
    case 'CLEAR_PROBLEM_SET':
        return {
            ...state,
            set: initialState.set,
            tempSet: {
                ...initialState.tempSet,
                title: `New Problem Set ${dayjs().format('MM-DD-YYYY')}`,
            },
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
            newSetSharecode: payload.shareCode,
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
            tempSet: {
                ...state.tempSet,
                problems: [
                    ...state.tempSet.problems,
                    payload.problem,
                ],
            },
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
            tempSet: {
                ...initialState.tempSet,
                title: `New Problem Set ${dayjs().format('MM-DD-YYYY')}`,
            },
            newSetSharecode: payload.shareCode,
            newSetShareEditCode: payload.editCode,
        };
    case 'RESET_TEMP_PROBLEMS':
        return {
            ...state,
            tempSet: initialState.tempSet,
        };
    case 'UPDATE_TEMP_SET':
        return {
            ...state,
            tempSet: {
                ...state.tempSet,
                ...payload,
            },
        };
    case 'UPDATE_SET':
        return {
            ...state,
            set: {
                ...state.set,
                ...payload,
            },
        };
    case 'SET_PROBLEM_DELETE_INDEX':
        return {
            ...state,
            problemToDeleteIndex: payload.problemToDeleteIndex,
        };
    case 'SET_EDIT_PROBLEM': {
        let set = null;
        if (payload.action === 'new') {
            set = state.tempSet;
        } else {
            set = state.set;
        }
        return {
            ...state,
            problemToEditIndex: payload.problemToEditIndex,
            problemToEdit: {
                ...set.problems[payload.problemToEditIndex],
            },
        };
    }
    case 'SET_TEMP_PALETTE':
        return {
            ...state,
            tempPalettes: payload.palettes,
        };
    case 'SET_REVIEW_SOLUTIONS':
        return {
            ...state,
            ...payload,
            set: {
                id: payload.id,
                problems: payload.solutions.map(solution => solution.problem),
                editCode: payload.editCode,
                shareCode: payload.reviewCode,
                title: payload.title || state.set.title,
                archiveMode: payload.archiveMode,
                source: payload.source || null,
            },
            newSetSharecode: payload.reviewCode,
        };
    case 'PARTNER_SUBMIT_OPTIONS_SUCCESS':
        return {
            ...state,
            set: {
                ...state.set,
                partner: payload,
            },
        };
    default:
        return state;
    }
};

export default problems;
