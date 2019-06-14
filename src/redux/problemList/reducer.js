import {
    CONFIRMATION,
    ADD_PROBLEM_SET,
    EDIT_PROBLEM,
} from '../../components/ModalContainer';

/* eslint-disable no-unused-vars */
const initialState = {
    revisionCode: null,
    defaultRevisionCode: null,
    set: {
        problems: [],
        editCode: null,
        shareCode: null,
        title: '',
    },
    notFound: false,
    activeModals: [],
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
    case 'TOGGLE_MODALS': {
        let oldModals = state.activeModals.slice();
        let actionUpdate = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const modal of payload.modals) {
            if (oldModals.indexOf(modal) !== -1) {
                oldModals = oldModals.filter(e => e !== modal);
            } else {
                if (modal === ADD_PROBLEM_SET) {
                    actionUpdate = {
                        tempProblems: [],
                    };
                } else if (modal === CONFIRMATION) {
                    actionUpdate = {
                        problemToDeleteIndex: payload.index,
                    };
                } else if (modal === EDIT_PROBLEM) {
                    actionUpdate = {
                        problemToEditIndex: payload.index,
                        problemToEdit: state.set.problems[payload.index],
                    };
                }
                oldModals.push(modal);
            }
        }
        return {
            ...state,
            ...actionUpdate,
            activeModals: oldModals,
        };
    }
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
    default:
        return state;
    }
};

export default problems;
