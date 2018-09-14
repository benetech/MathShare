
import { stackDeleteAction, stackAddAction } from './stack';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import createAlert from '../../scripts/alert';
import Locales from '../../strings';

function addNewStep(context, step) {
    let newSteps = context.state.solution.steps;
    newSteps.push(step);
    let updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(step.cleanup);

    var solution = context.state.solution;
    solution.steps = newSteps;
    context.setState({
        editorPosition: context.countEditorPosition(newSteps),
        solution: solution,
        theActiveMathField: updatedMathField,
        textAreaValue: ""
    });
}

function deleteStep(context, addToHistory) {
    var steps = context.state.solution.steps;
    var lastStep = steps[steps.length - 1];

    if (addToHistory) {
        stackDeleteAction(context, lastStep);
    }

    context.state.displayScratchpad();
    deleteLastStep(context);
}

function deleteLastStep(context) {
    let newSteps = context.state.solution.steps;
    newSteps.pop();
    context.setState({
        steps: newSteps,
        editorPosition: context.countEditorPosition(context.state.solution.steps)
    }, context.restoreEditorPosition);
}

function editStep(context, stepNumber) {
    let mathStep = context.state.solution.steps[stepNumber - 1];
    let updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(mathStep.stepValue);
    context.state.displayScratchpad(mathStep.scratchpad);
    context.setState({
        editedStep: stepNumber - 1,
        theActiveMathField: updatedMathField,
        textAreaValue: mathStep.explanation,
        editing: true,
        updateMathFieldMode: true
    },
        () => context.moveEditorBelowSpecificStep(stepNumber)
    );
}

function updateStep(context, img) {
    var index = context.state.editedStep;

    if (context.state.textAreaValue === '') {
        createAlert('warning', Locales.strings.no_description_warning, 'Warning');
        setTimeout(function () {
            $('#mathAnnotation').focus();
        }, 6000);
        return;
    }
    let mathStep = Object.assign({}, context.state.solution.steps[index]);
    let cleanedup = MathButton.CleanUpCrossouts(context.state.theActiveMathField.latex());
    let cleanup = cleanedup === context.state.theActiveMathField.latex() ? null : cleanedup;
    context.updateMathEditorRow(context.state.theActiveMathField.latex(), index, cleanup, img);
    context.cancelEditCallback(mathStep.stepValue, mathStep.explanation, mathStep.cleanup, index, mathStep.scratchpad);
    createAlert('success', Locales.strings.successfull_update_message, 'Success');
    context.state.displayScratchpad();
}

function addStep(context, addToHistory, img) {
    if (!context.state.textAreaValue || context.state.textAreaValue === "" || $.trim(context.state.textAreaValue).length === 0) {
        createAlert('warning', Locales.strings.no_description_warning, 'Warning');
        setTimeout(function () {
            $('#mathAnnotation').focus();
        }, 6000);
        return;
    }
    let mathContent = context.state.theActiveMathField.latex();
    let explanation = context.state.textAreaValue;
    var cleanedUp = MathButton.CleanUpCrossouts(mathContent);
    let cleanup = cleanedUp != mathContent ? cleanedUp : null;
    var step = { "stepValue": mathContent, "explanation": explanation, "cleanup": cleanup, "scratchpad": img };
    if (addToHistory) {
        stackAddAction(context, step);
    }

    addNewStep(context, step);
    context.state.displayScratchpad();
    context.scrollToBottom();
}

export { deleteStep, editStep, updateStep, addStep };
