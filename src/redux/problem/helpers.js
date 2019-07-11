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
