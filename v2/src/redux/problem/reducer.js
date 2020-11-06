import {
    LOCATION_CHANGE,
} from 'connected-react-router';
import Locales from '../../strings';
import {
    countEditorPosition,
    getLastTextArea,
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
    currentStep: 0,
    editorPosition: 0,
    keyboardVisible: false,
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

const emptyStep = { stepValue: '', explanation: '' };

const problem = (state = initialState, {
    type,
    payload,
    // error,
}) => {
    switch (type) {
    case 'KEYBOARD_VISIBLE': {
        const { keyboardVisible } = payload;
        return {
            ...state,
            keyboardVisible,
        };
    }
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
    case 'REQUEST_LOAD_PROBLEM_SUCCESS': {
        let editing = false;
        let editorPosition = countEditorPosition(payload.solution.steps);
        let editedStep = state.editedStep;
        if (payload.solution.editorPosition !== null && payload.solution.editorPosition > -1) {
            editing = true;
            editorPosition = payload.solution.editorPosition;
        } else if (payload.solution.problem.editorPosition !== null
            && payload.solution.problem.editorPosition > -1) {
            editing = true;
            editorPosition = payload.solution.problem.editorPosition;
        }
        if (editing) {
            editedStep = editorPosition;
        }
        return {
            ...state,
            solution: {
                ...payload.solution,
                steps: [...payload.solution.steps, { stepValue: '', explanation: '' }],
            },
            editing,
            editedStep,
            editorPosition,
            readOnly: (payload.action === 'view'),
            stepsFromLastSave: JSON.parse(JSON.stringify(payload.solution.steps)),
            allowedPalettes: payload.solution.palettes,
            tourOpen: false,
            actionsStack: [],
            textAreaValue: getLastTextArea(payload.solution.steps),
            work: {
                ...initialState.work,
                scratchpadMode: state.work.scratchpadMode,
            },
        };
    }
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
    case 'PROCESS_FETCHED_PROBLEM': {
        const { solution, action } = payload;
        let textAreaValue = initialState.textAreaValue;
        if (action === 'edit') {
            textAreaValue = solution.problem.title;
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
    case 'DUPLICATE_STEP': {
        const { index } = payload;
        const step = state.solution.steps[index];
        const newSteps = state.solution.steps.slice();
        newSteps.splice(index + 1, 0, step);
        return {
            ...state,
            solution: {
                ...state.solution,
                steps: newSteps,
            },
        };
    }
    case 'DELETE_STEP': {
        const { index } = payload;
        const steps = state.solution.steps.filter((_, currentIndex) => currentIndex !== index);
        if (steps.length === 0) {
            steps.push({ ...emptyStep });
        }
        return {
            ...state,
            solution: {
                ...state.solution,
                steps,
            },
        };
    }
    case 'ADD_STEP': {
        const steps = state.solution.steps.slice();
        const { currentStep } = state;
        if (currentStep >= (steps.length - 1)) {
            steps.push({
                ...emptyStep,
            });
        } else {
            steps.splice(currentStep + 1, 0, {
                ...emptyStep,
            });
        }
        return {
            ...state,
            solution: {
                ...state.solution,
                steps,
            },
        };
    }
    case 'UPDATE_STEP_MATH': {
        const { index, stepValue } = payload;
        return {
            ...state,
            solution: {
                ...state.solution,
                steps: state.solution.steps.map((step, currentIndex) => {
                    if (currentIndex === index) {
                        return {
                            ...step,
                            stepValue,
                        };
                    }
                    return step;
                }),
            },
        };
    }
    case 'UPDATE_STEP_EXPLANATION': {
        const { index, explanation } = payload;
        return {
            ...state,
            solution: {
                ...state.solution,
                steps: state.solution.steps.map((step, currentIndex) => {
                    if (currentIndex === index) {
                        return {
                            ...step,
                            explanation,
                        };
                    }
                    return step;
                }),
            },
        };
    }
    case 'SET_CURRENT_STEP': {
        return {
            ...state,
            currentStep: payload.currentStep,
        };
    }
    default:
        return state;
    }
};

export default problem;
