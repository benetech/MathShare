
import { deleteStep, addStep } from './stepsOperations';

const DELETE = "delete";
const CLEAR_ALL = "clear all";
const ADD = "add";
const EDIT = "edit";

function undoLastAction(context) {
    var newStack = context.state.actionsStack;
    var stackEntry = newStack.pop();
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
            throw "Unsupported action type";
    }
}

function undoClearAll(context, stackEntry) {
    var solution = context.state.solution;
    var theActiveMathField = context.state.theActiveMathField;
    theActiveMathField.latex(stackEntry.steps[stackEntry.steps.length - 1].stepValue);
    solution.steps = stackEntry.steps;
    context.setState({
        solution, theActiveMathField,
        textAreaValue: ""
    });
}

function undoDelete(context, stackEntry) {
    let updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(stackEntry.step.stepValue);
    context.setState({
        theActiveMathField: updatedMathField,
        textAreaValue: stackEntry.step.explanation
    }, () => addStep(context));
}

function undoEdit(context, stackEntry) {
    let step = stackEntry.step.id == context.state.solution.steps.length - 1 ?
        stackEntry.step :
        context.state.solution.steps[context.state.solution.steps.length - 1];
    let updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(step.cleanup ? step.cleanup : step.stepValue);
    console.log(stackEntry)
    console.log(step)
    context.setState({
        theActiveMathField: updatedMathField,
        textAreaValue: step.explanation
    }, () => {
        context.updateMathEditorRow(stackEntry.step.stepValue, stackEntry.step.explanation, stackEntry.step.id, stackEntry.step.cleanup, stackEntry.step.scratchpad)
    });
}

function undoAdd(context) {
    deleteStep(context);
}

function stackDeleteAction(context, step) {
    var actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: DELETE,
        step: step
    });
    context.setState({ actionsStack });
}

function stackAddAction(context, step) {
    var actionsStack = context.state.actionsStack;
    actionsStack.push({
        type: ADD,
        step: step
    });
    context.setState({ actionsStack });
}

function clearAll(context) {
    var stack = context.state.actionsStack;
    var steps = context.state.solution.steps;
    stack.push({
        type: CLEAR_ALL,
        steps: steps
    });

    var solution = context.state.solution;
    var firstStep = solution.steps[0];
    solution.steps = [];
    solution.steps.push(firstStep);
    var math = context.state.theActiveMathField;
    math.latex(solution.steps[0].stepValue);
    context.setState({
        textAreaValue: "",
        actionsStack: stack,
        solution: solution,
        theActiveMathField: math
    });
}

function stackEditAction(context, index, oldEquation, cleanup, oldExplanation, img) {
    var newStack = context.state.actionsStack;
    if (index) {
        var oldStep = { "id": index, "stepValue": oldEquation, "cleanup": cleanup, "explanation": oldExplanation, "scratchpad": img };
        newStack.push({
            type: EDIT,
            step: oldStep
        });
    }
    context.setState({
        textAreaValue: "",
        actionsStack: newStack,
        updateMathFieldMode: false
    });
}

export { undoLastAction, stackDeleteAction, stackAddAction, clearAll, stackEditAction };
