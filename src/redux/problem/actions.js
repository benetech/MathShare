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

export const commitProblemSolution = (redirectBack, shareModal) => ({
    type: 'REQUEST_COMMIT_PROBLEM_SOLUTION',
    payload: {
        redirectBack,
        shareModal,
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
};
