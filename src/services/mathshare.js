
export const getMathshareLink = (params, currentSolution, problem) => {
    const { action, code, position } = params;
    if (position) {
        return `/app/problemSet/edit/${code}/${problem.position}`;
    }
    if (currentSolution && (currentSolution.editCode || currentSolution.shareCode)) {
        if (currentSolution.editCode && action !== 'review') {
            return `/app/problem/edit/${currentSolution.editCode}`;
        }
        return `/app/problem/view/${currentSolution.shareCode}`;
    }
    if (action === 'edit') {
        return `/app/problemSet/edit/${code}/${problem.position}`;
    }
    return null;
};

export default {
    getMathshareLink,
};
