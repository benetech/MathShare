
import { deleteStep, addStep } from './stepsOperations';

const DELETE = 'delete';
const CLEAR_ALL = 'clear all';
const ADD = 'add';
const EDIT = 'edit';

function undoClearAll(context, stackEntry) {
    const solution = context.state.solution;
    const theActiveMathField = context.state.theActiveMathField;
    theActiveMathField.latex(stackEntry.steps[stackEntry.steps.length - 1].stepValue);
    solution.steps = stackEntry.steps;
    context.setState({
        solution,
        theActiveMathField,
        textAreaValue: '',
    });
}

function undoDelete(context, stackEntry) {
    const updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(stackEntry.step.stepValue);
    context.setState({
        theActiveMathField: updatedMathField,
        textAreaValue: stackEntry.step.explanation,
    }, () => addStep(context, false, stackEntry.step.scratchpad));
}

function undoEdit(context, stackEntry) {
    const step = stackEntry.step.id === context.state.solution.steps.length - 1
        ? stackEntry.step
        : context.state.solution.steps[context.state.solution.steps.length - 1];
    const updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(step.cleanup ? step.cleanup : step.stepValue);
    context.setState({
        theActiveMathField: updatedMathField,
        textAreaValue: step.explanation,
    }, () => {
        context.updateMathEditorRow(stackEntry.step.stepValue, stackEntry.step.explanation,
            stackEntry.step.id, stackEntry.step.cleanup, stackEntry.step.scratchpad);
    });
}

function undoAdd(context) {
    deleteStep(context);
}

function undoLastAction(context) {
    const newStack = context.state.actionsStack;
    const stackEntry = newStack.pop();
    context.setState({ actionsStack: newStack });
    switch (stackEntry.type) {
    case DELETE:
        undoDelete(context, stackEntry);
        break;
    case CLEAR_ALL:
        undoClearAll(context, stackEntry);
        break;
    case ADD:
        undoAdd(context);
        break;
    case EDIT:
        undoEdit(context, stackEntry);
        break;
    default:
        throw new Error('Unsupported action type');
    }
}

function stackDeleteAction(context, step) {
    const actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: DELETE,
        step,
    });
    context.setState({ actionsStack });
}

function stackAddAction(context, step) {
    const actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: ADD,
        step,
    });
    context.setState({ actionsStack });
}

function clearAll(context) {
    const stack = context.state.actionsStack;
    const steps = context.state.solution.steps;
    stack.push({
        type: CLEAR_ALL,
        steps,
    });

    const solution = context.state.solution;
    const firstStep = solution.steps[0];
    solution.steps = [];
    solution.steps.push(firstStep);
    const math = context.state.theActiveMathField;
    math.latex(solution.steps[0].stepValue);
    context.setState({
        textAreaValue: '',
        actionsStack: stack,
        solution,
        theActiveMathField: math,
    });
}

function stackEditAction(context, index, oldEquation, cleanup, oldExplanation, img) {
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
}

export {
    undoLastAction, stackDeleteAction, stackAddAction, clearAll, stackEditAction,
};
