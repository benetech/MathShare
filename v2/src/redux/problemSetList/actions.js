/* eslint-disable no-return-assign */

export const requestExampleSets = () => ({
    type: 'REQUEST_EXAMPLE_SETS',
});

export const duplicateProblemSet = payload => ({
    type: 'DUPLICATE_PROBLEM_SET',
    payload: (payload || {}),
});

export const archiveProblemSet = (editCode, archiveMode, title, isSolutionSet, goTo) => ({
    type: 'ARCHIVE_PROBLEM_SET',
    payload: {
        editCode,
        archiveMode,
        title,
        isSolutionSet,
        goTo,
    },
});

export default {
    archiveProblemSet,
    duplicateProblemSet,
    requestExampleSets,
};
