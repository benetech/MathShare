export const loadProblem = (action, code) => ({
    type: 'REQUEST_LOAD_PROBLEM',
    payload: {
        action,
        code,
    },
});

export const loadExampleProblem = exampleProblem => ({
    type: 'LOAD_EXAMPLE_PROBLEM',
    payload: {
        exampleProblem,
    },
});

export const setProblemNotFound = () => ({
    type: 'SET_PROBLEM_NOT_FOUND',
});

export const setSolutionData = (solution, action) => ({
    type: 'REQUEST_LOAD_PROBLEM_SUCCESS',
    payload: {
        solution,
        action,
    },
});

export const setActiveMathFieldInProblem = field => ({
    type: 'SET_ACTIVE_MATH_FIELD_IN_PROBLEM',
    payload: {
        field,
    },
});

export const updateProblemStore = payload => ({
    type: 'UPDATE_PROBLEM_STORE',
    payload,
});

export const updateProblemSolution = (solution, onlyLoad) => ({
    type: 'UPDATE_PROBLEM_SOLUTION',
    payload: {
        solution,
        onlyLoad,
    },
});

export const commitProblemSolution = (redirectTo, shareModal, finished) => ({
    type: 'REQUEST_COMMIT_PROBLEM_SOLUTION',
    payload: {
        redirectTo,
        shareModal,
        finished,
    },
});

export const openTour = () => ({
    type: 'OPEN_TOUR',
});

export const closeTour = () => ({
    type: 'CLOSE_TOUR',
});

export const toggleTour = () => ({
    type: 'TOGGLE_TOUR',
});

export const updateWork = payload => ({
    type: 'UPDATE_WORK',
    payload,
});

export const resetProblem = () => ({
    type: 'RESET_PROBLEM',
});

export const duplicateStep = index => ({
    type: 'DUPLICATE_STEP',
    payload: {
        index,
    },
});

export const deleteStep = index => ({
    type: 'DELETE_STEP',
    payload: {
        index,
    },
});

export const addStep = index => ({
    type: 'ADD_STEP',
    payload: {
        index,
    },
});

export const updateStepMath = (index, stepValue) => ({
    type: 'UPDATE_STEP_MATH',
    payload: {
        index,
        stepValue,
    },
});

export const updateStepExplanation = (index, explanation) => ({
    type: 'UPDATE_STEP_EXPLANATION',
    payload: {
        index,
        explanation,
    },
});

export const setCurrentStep = currentStep => ({
    type: 'SET_CURRENT_STEP',
    payload: {
        currentStep,
    },
});

export default {
    commitProblemSolution,
    loadExampleProblem,
    loadProblem,
    setActiveMathFieldInProblem,
    setProblemNotFound,
    setSolutionData,
    updateProblemStore,
    updateProblemSolution,
    openTour,
    closeTour,
    toggleTour,
    updateWork,
    resetProblem,
    duplicateStep,
    deleteStep,
    addStep,
    updateStepExplanation,
    updateStepMath,
    setCurrentStep,
};
