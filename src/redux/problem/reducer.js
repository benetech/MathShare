import {
    LOCATION_CHANGE,
} from 'connected-react-router';
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
    displayScratchpad: () => {},
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
    case 'RESET_PROBLEM':
        return {
            ...initialState,
            work: {
                ...initialState.work,
                scratchpadMode: state.work.scratchpadMode,
            },
        };
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
            work: {
                ...initialState.work,
                scratchpadMode: state.work.scratchpadMode,
            },
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
    case 'CLEAR_SCRATCH_PAD_CONTENT': {
        try {
            if (state.work.scratchPadPainterro) {
                state.work.scratchPadPainterro.clear();
            }
        // eslint-disable-next-line no-empty
        } catch (error) { }
        return {
            ...state,
            work: {
                ...state.work,
                scratchpadContent: initialState.work.scratchpadContent,
            },
        };
    }
    case 'SET_EDIT_PROBLEM': {
        let textAreaValue = initialState.textAreaValue;
        if (payload.action === 'edit') {
            textAreaValue = payload.textAreaValue;
        }
        return {
            ...state,
            textAreaValue,
        };
    }
    case LOCATION_CHANGE:
        if (payload.action === 'POP' && payload.location.pathname.indexOf('/app/problemSet/') > -1) {
            return {
                ...state,
                textAreaValue: initialState.textAreaValue,
                stepsFromLastSave: initialState.stepsFromLastSave,
                solution: initialState.solution,
            };
        }
        return state;
    case 'TOGGLE_MODALS': {
        if (payload.modals.includes('addProblems')) {
            return {
                ...state,
                textAreaValue: initialState.textAreaValue,
            };
        }
        return state;
    }
    default:
        return state;
    }
};

export default problem;
