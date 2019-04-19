import {
    ADD,
    EDIT,
    DELETE,
} from './stackConstants';

export const stackDeleteAction = (context, step) => {
    const actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: DELETE,
        step,
    });
    context.setState({
        actionsStack,
    });
};

export const stackAddAction = (context, step) => {
    const actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: ADD,
        step,
    });
    context.setState({
        actionsStack,
    });
};

export const stackEditAction = (context, index, oldEquation, cleanup, oldExplanation, img) => {
    const newStack = context.state.actionsStack;
    if (index) {
        const oldStep = {
            id: index,
            stepValue: oldEquation,
            cleanup,
            explanation: oldExplanation,
            scratchpad: img,
        };
        newStack.push({
            type: EDIT,
            step: oldStep,
        });
    }
    context.setState({
        textAreaValue: '',
        actionsStack: newStack,
        updateMathFieldMode: false,
    });
};
