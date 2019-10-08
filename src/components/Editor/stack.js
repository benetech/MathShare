import {
    deleteStep,
    addStep,
} from './stepsOperations';
import {
    ADD,
    CLEAR_ALL,
    DELETE,
    EDIT,
} from './stackConstants';
import googleAnalytics from '../../scripts/googleAnalytics';

function undoClearAll(context, stackEntry) {
    const {
        problemStore,
        problemList,
    } = context.props;
    const solution = problemStore.solution;
    const theActiveMathField = problemList.theActiveMathField;
    theActiveMathField.$latex(stackEntry.steps[stackEntry.steps.length - 1].stepValue);
    solution.steps = stackEntry.steps;
    context.setState({
        solution,
        theActiveMathField,
        textAreaValue: '',
    });
}

function undoDelete(context, stackEntry) {
    const updatedMathField = context.props.problemList.theActiveMathField;
    updatedMathField.$latex(stackEntry.step.stepValue);
    context.setState({
        theActiveMathField: updatedMathField,
        textAreaValue: stackEntry.step.explanation,
    }, () => addStep(context, false, stackEntry.step.scratchpad));
}

function undoEdit(context, stackEntry) {
    const {
        problemStore,
        problemList,
    } = context.props;
    const step = stackEntry.step.id === problemStore.solution.steps.length - 1
        ? stackEntry.step
        : problemStore.solution.steps[problemStore.solution.steps.length - 1];
    const updatedMathField = problemList.theActiveMathField;
    updatedMathField.$latex(step.cleanup ? step.cleanup : step.stepValue);
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
    const {
        problemStore,
    } = context.props;
    const newStack = problemStore.actionsStack;
    const stackEntry = newStack.pop();
    context.setState({
        actionsStack: newStack,
    });
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

function clearAll(context) {
    googleAnalytics('Clear All');
    const {
        problemList,
        problemStore,
    } = context.props;
    const stack = problemStore.actionsStack;
    const steps = problemStore.solution.steps;
    stack.push({
        type: CLEAR_ALL,
        steps,
    });

    const solution = problemStore.solution;
    const firstStep = solution.steps[0];
    solution.steps = [];
    solution.steps.push(firstStep);
    const math = problemList.theActiveMathField;
    math.$latex(solution.steps[0].stepValue);
    context.setState({
        textAreaValue: '',
        actionsStack: stack,
        solution,
        theActiveMathField: math,
    });
}

export {
    undoLastAction,
    clearAll,
};
