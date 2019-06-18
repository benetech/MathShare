/* eslint-disable no-return-assign */

export const requestDefaultRevision = () => ({
    type: 'REQUEST_DEFAULT_REVISION',
});

export const requestProblemSet = (action, code) => ({
    type: 'REQUEST_PROBLEM_SET',
    payload: {
        action,
        code,
    },
});

export const addProblem = (imageData, text, index, newProblemSet) => ({
    type: 'REQUEST_ADD_PROBLEM',
    payload: {
        imageData,
        text,
        index,
        newProblemSet,
    },
});

export const deleteProblem = () => ({
    type: 'REQUEST_DELETE_PROBLEM',
});

export const saveProblems = newProblems => ({
    type: 'REQUEST_SAVE_PROBLEMS',
    payload: {
        newProblems,
    },
});

export const updateProblemList = problemList => ({
    type: 'UPDATE_PROBLEM_LIST',
    payload: {
        problemList,
    },
});

export const toggleModals = (modals, index) => ({
    type: 'TOGGLE_MODALS',
    payload: {
        modals,
        index,
    },
});

export const setActiveMathField = field => ({
    type: 'SET_ACTIVE_MATH_FIELD',
    payload: {
        field,
    },
});

export const setTempPalettes = palettes => ({
    type: 'SET_TEMP_PALETTE',
    payload: {
        palettes,
    },
});

export const shareSolutions = (action, code) => ({
    type: 'REQUEST_SHARE_SOLUTIONS',
    payload: {
        action,
        code,
    },
});

export const setProblemSetShareCode = problemSetShareCode => ({
    type: 'SET_PROBLEM_SET_SHARE_CODE',
    payload: {
        problemSetShareCode,
    },
});

export const saveProblemSet = (problems, title) => ({
    type: 'REQUEST_SAVE_PROBLEM_SET',
    payload: {
        problems,
        title,
    },
});

export const resetProblemSet = () => ({
    type: 'RESET_PROBLEM_SET',
});

export const editProblem = (imageData, title) => ({
    type: 'REQUEST_EDIT_PROBLEM',
    payload: {
        imageData,
        title,
    },
});

export default {
    addProblem,
    deleteProblem,
    editProblem,
    requestDefaultRevision,
    requestProblemSet,
    resetProblemSet,
    toggleModals,
    saveProblems,
    saveProblemSet,
    setTempPalettes,
    setActiveMathField,
    shareSolutions,
    setProblemSetShareCode,
    updateProblemList,
};
