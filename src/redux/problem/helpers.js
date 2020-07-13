export const countCleanups = (steps) => {
    let cleanups = 0;
    steps.forEach((step) => {
        if (step.cleanup) {
            cleanups += 1;
        }
    });
    return cleanups;
};
export const countEditorPosition = steps => steps.length + countCleanups(steps) - 1;

export const compareStepArrays = (first, second) => {
    if (first.length !== second.length) {
        return false;
    }
    for (let i = 0; i < first.length; i += 1) {
        if (first[i].stepValue !== second[i].stepValue
            || first[i].explanation !== second[i].explanation
            || first[i].scratchpad !== second[i].scratchpad) {
            return false;
        }
    }
    return true;
};

export const getLastTextArea = (steps) => {
    if (!steps || steps.length === 0) {
        return '';
    }
    const stepLength = steps.length;
    return steps[stepLength - 1].explanation;
};
