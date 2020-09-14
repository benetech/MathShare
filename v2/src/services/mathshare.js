
export const getMathshareLink = (params, currentSolution, problem) => {
    const { action, code, position } = params;
    if (position) {
        return `/app/problemSet/edit/${code}/${problem.position}`;
    }
    if (currentSolution && (currentSolution.editCode || currentSolution.shareCode)) {
        if (currentSolution.editCode && action !== 'review' && action !== 'view') {
            return `/app/problem/edit/${currentSolution.editCode}`;
        }
        return `/app/problem/view/${currentSolution.shareCode}`;
    }
    if (action === 'edit') {
        return `/app/problemSet/edit/${code}/${problem.position}`;
    }
    return null;
};

export const getFormattedUserType = (userType) => {
    if (userType === 'teacher') {
        return 'Teacher';
    }
    if (userType === 'student') {
        return 'Student';
    }
    return 'Undefined';
};

export default {
    getFormattedUserType,
    getMathshareLink,
};
