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
    theActiveMathField: null,
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
        };
    case 'SET_ACTIVE_MATH_FIELD_IN_PROBLEM':
        return {
            ...state,
            theActiveMathField: payload.field,
        };
    case 'UPDATE_PROBLEM_STORE':
        return {
            ...state,
            ...payload,
        };
    default:
        return state;
    }
};

export default problem;
