import Locales from '../../strings';
import {
    countEditorPosition,
} from './helpers';

export const initialState = {
    solution: {
        problem: {
            title: Locales.strings.loading,
            text: Locales.strings.loading,
        },
        steps: [{
            stepValue: '',
            explanation: Locales.strings.loading,
        }],
        editCode: null,
    },
    stepsFromLastSave: [{
        stepValue: '',
        explanation: Locales.strings.loading,
    }],
    editorPosition: 0,
    editedStep: null,
    allowedPalettes: [],
    textAreaValue: '',
    actionsStack: [],
    updateMathFieldMode: false,
    editing: false,
    shareLink: 'http:mathshare.com/exampleShareLink/1',
    editLink: Locales.strings.not_saved_yet,
    readOnly: false,
    displayScratchpad: null,
    notFound: false,
    isUpdated: false,
    lastSaved: null,
    tourOpen: false,
    work: {
        isScratchpadUsed: false,
        scratchpadMode: false,
        scratchpadContent: null,
    },
};

const problem = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'LOAD_EXAMPLE_PROBLEM':
        return {
            ...state,
            solution: {
                problem: payload.exampleProblem,
                steps: payload.exampleProblem.steps,
            },
            editorPosition: countEditorPosition(payload.exampleProblem.steps),
            readOnly: false,
            allowedPalettes: 'Edit;Operators;Notations;Geometry',
            tourOpen: false,
            actionsStack: [],
            textAreaValue: '',
            work: initialState.work,
        };
    case 'SET_PROBLEM_NOT_FOUND':
        return {
            ...state,
            notFound: true,
        };
    case 'REQUEST_LOAD_PROBLEM_SUCCESS':
        return {
            ...state,
            solution: payload.solution,
            editorPosition: countEditorPosition(payload.solution.steps),
            readOnly: (payload.action === 'view'),
            stepsFromLastSave: JSON.parse(JSON.stringify(payload.solution.steps)),
            allowedPalettes: payload.solution.palettes,
            tourOpen: false,
            actionsStack: [],
            textAreaValue: '',
            work: initialState.work,
        };
    case 'UPDATE_PROBLEM_STORE':
        return {
            ...state,
            ...payload,
        };
    case 'OPEN_TOUR':
        return {
            ...state,
            tourOpen: true,
        };
    case 'CLOSE_TOUR':
        return {
            ...state,
            tourOpen: false,
        };
    case 'TOGGLE_TOUR':
        return {
            ...state,
            tourOpen: !state.tourOpen,
        };
    case 'UPDATE_WORK':
        return {
            ...state,
            work: {
                ...state.work,
                ...payload,
            },
        };
    default:
        return state;
    }
};

export default problem;
