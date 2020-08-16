/* eslint-disable no-return-assign */

export const requestDefaultRevision = () => ({
    type: 'REQUEST_DEFAULT_REVISION',
});

export const requestExampleSets = () => ({
    type: 'REQUEST_EXAMPLE_SETS',
});

export const requestArchivedSets = () => ({
    type: 'REQUEST_ARCHIVED_SETS',
});

export const requestProblemSet = (action, code, position) => ({
    type: 'REQUEST_PROBLEM_SET',
    payload: {
        action,
        code,
        position,
    },
});

export const requestProblemSetSuccess = payload => ({
    type: 'REQUEST_PROBLEM_SET_SUCCESS',
    payload,
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

export const updateProblemSetPayload = (updatePayload, successMsg, errorMsg) => ({
    type: 'REQUEST_UPDATE_PROBLEMS',
    payload: {
        updatePayload,
        successMsg,
        errorMsg,
    },
});

export const updateProblemList = problemList => ({
    type: 'UPDATE_PROBLEM_LIST',
    payload: {
        problemList,
    },
});

export const toggleModals = (modals, index, link) => ({
    type: 'TOGGLE_MODALS',
    payload: {
        modals,
        index,
        link: link || null,
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

export const setEditProblem = (index, action, textAreaValue) => ({
    type: 'SET_EDIT_PROBLEM',
    payload: {
        problemToEditIndex: index,
        action,
        textAreaValue,
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

export const archiveProblemSet = (editCode, archiveMode, title, isSolutionSet) => ({
    type: 'ARCHIVE_PROBLEM_SET',
    payload: {
        editCode,
        archiveMode,
        title,
        isSolutionSet,
    },
});

export const duplicateProblemSet = (e, payload) => ({
    type: 'DUPLICATE_PROBLEM_SET',
    payload: (payload || {}),
});

export const setReviewSolutions = (
    id, solutions, reviewCode, editCode, title, archiveMode, source,
) => ({
    type: 'SET_REVIEW_SOLUTIONS',
    payload: {
        id,
        solutions,
        reviewCode,
        editCode,
        title,
        archiveMode,
        source,
    },
});

export const updateReviewSolutions = solutions => ({
    type: 'UPDATE_REVIEW_SOLUTIONS',
    payload: {
        solutions,
    },
});

export const loadProblemSetSolutionByEditCode = editCode => ({
    type: 'LOAD_PROBLEM_SET_SOLUTION_BY_EDIT_CODE',
    payload: {
        editCode,
    },
});

export const submitToPartner = (id, editCode, shareCode) => ({
    type: 'REQUEST_SUBMIT_TO_PARTNER',
    payload: {
        id,
        editCode,
        shareCode,
    },
});

export default {
    addProblem,
    archiveProblemSet,
    clearProblemSet,
    deleteProblem,
    duplicateProblemSet,
    editProblem,
    finishEditing,
    requestArchivedSets,
    requestDefaultRevision,
    requestProblemSet,
    requestProblemSetSuccess,
    updateProblemSetPayload,
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
    setReviewSolutions,
    updateProblemList,
    updateSet,
    updateTempSet,
    updateProblemSetTitle,
    updateReviewSolutions,
    loadProblemSetSolutionByEditCode,
    submitToPartner,
};
