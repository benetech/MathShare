/* eslint-disable no-return-assign */

export const requestDefaultRevision = () => ({
    type: 'REQUEST_DEFAULT_REVISION',
});

export const requestExampleSets = () => ({
    type: 'REQUEST_EXAMPLE_SETS',
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

export const shareSolutions = (action, code, silent) => ({
    type: 'REQUEST_SHARE_SOLUTIONS',
    payload: {
        action,
        code,
        silent,
    },
});

export const setProblemSetShareCode = problemSetShareCode => ({
    type: 'SET_PROBLEM_SET_SHARE_CODE',
    payload: {
        problemSetShareCode,
    },
});

export const saveProblemSet = (problems, title, redirect) => ({
    type: 'REQUEST_SAVE_PROBLEM_SET',
    payload: {
        problems,
        title,
        redirect,
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

export const clearProblemSet = () => ({
    type: 'CLEAR_PROBLEM_SET',
});

export const updateTempSet = payload => ({
    type: 'UPDATE_TEMP_SET',
    payload,
});

export const updateSet = payload => ({
    type: 'UPDATE_SET',
    payload,
});

export const resetTempProblems = () => ({
    type: 'RESET_TEMP_PROBLEMS',
});

export const setEditProblem = (index, action) => ({
    type: 'SET_EDIT_PROBLEM',
    payload: {
        problemToEditIndex: index,
        action,
    },
});

export const finishEditing = redirect => ({
    type: 'FINISH_EDITING',
    payload: {
        redirect,
    },
});


export const updateProblemSetTitle = title => ({
    type: 'UPDATE_PROBLEM_SET_TITLE',
    payload: {
        title,
    },
});

export const duplicateProblemSet = () => ({
    type: 'DUPLICATE_PROBLEM_SET',
});

export const setReviewSolutions = solutions => ({
    type: 'SET_REVIEW_SOLUTIONS',
    payload: {
        solutions,
    },
});

export default {
    addProblem,
    clearProblemSet,
    deleteProblem,
    duplicateProblemSet,
    editProblem,
    finishEditing,
    requestDefaultRevision,
    requestProblemSet,
    resetProblemSet,
    resetTempProblems,
    toggleModals,
    saveProblems,
    saveProblemSet,
    setEditProblem,
    setTempPalettes,
    setActiveMathField,
    shareSolutions,
    setProblemSetShareCode,
    updateProblemList,
    updateSet,
    updateTempSet,
    updateProblemSetTitle,
};
