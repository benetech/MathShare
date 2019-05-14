import { stackDeleteAction, stackAddAction } from './stackOperations';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import { alertSuccess, alertWarning } from '../../scripts/alert';
import Locales from '../../strings';
import googleAnalytics from '../../scripts/googleAnalytics';

function addNewStep(context, step) {
    googleAnalytics('Add new step');
    const newSteps = context.state.solution.steps;
    newSteps.push(step);
    const updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(step.cleanup);

    const solution = context.state.solution;
    solution.steps = newSteps;
    context.setState({
        editorPosition: context.countEditorPosition(newSteps),
        solution,
        theActiveMathField: updatedMathField,
        textAreaValue: '',
    });
}

function deleteLastStep(context) {
    googleAnalytics('Delete last step');
    const newSteps = context.state.solution.steps;
    newSteps.pop();
    context.setState({
        steps: newSteps,
        editorPosition: context.countEditorPosition(context.state.solution.steps),
    }, context.restoreEditorPosition);
}

function deleteStep(context, addToHistory) {
    googleAnalytics('Delete step');
    const steps = context.state.solution.steps;
    const lastStep = steps[steps.length - 1];

    if (addToHistory) {
        stackDeleteAction(context, lastStep);
    }

    context.state.displayScratchpad();
    deleteLastStep(context);
}

function editStep(context, stepNumber) {
    googleAnalytics('Edit step');
    const mathStep = context.state.solution.steps[stepNumber - 1];
    const updatedMathField = context.state.theActiveMathField;
    updatedMathField.latex(mathStep.stepValue);
    context.state.displayScratchpad(mathStep.scratchpad);
    context.setState({
        editedStep: stepNumber - 1,
        theActiveMathField: updatedMathField,
        textAreaValue: mathStep.explanation,
        editing: true,
        updateMathFieldMode: true,
    },
    () => context.moveEditorBelowSpecificStep(stepNumber));
}

function updateStep(context, img) {
    googleAnalytics('Edit step');
    const index = context.state.editedStep;

    if (context.state.textAreaValue === '') {
        alertWarning(Locales.strings.no_description_warning, 'Warning');
        setTimeout(() => {
            $('#mathAnnotation').focus();
        }, 6000);
        return;
    }
    const mathStep = Object.assign({}, context.state.solution.steps[index]);
    const cleanedup = MathButton.CleanUpCrossouts(context.state.theActiveMathField.latex());
    const cleanup = cleanedup === context.state.theActiveMathField.latex() ? null : cleanedup;
    context.updateMathEditorRow(context.state.theActiveMathField.latex(),
        context.state.textAreaValue, index, cleanup, img);
    context.cancelEditCallback(mathStep.stepValue, mathStep.explanation,
        mathStep.cleanup, index, mathStep.scratchpad);
    alertSuccess(Locales.strings.successfull_update_message, 'Success');
    context.state.displayScratchpad();
}

function addStep(context, addToHistory, img) {
    if (!context.state.textAreaValue || context.state.textAreaValue === '' || $.trim(context.state.textAreaValue).length === 0) {
        alertWarning(Locales.strings.no_description_warning, 'Warning');
        setTimeout(() => {
            $('#mathAnnotation').focus();
        }, 6000);
        return false;
    }
    const mathContent = context.state.theActiveMathField.latex();
    const explanation = context.state.textAreaValue;
    const cleanedUp = MathButton.CleanUpCrossouts(mathContent);
    const cleanup = cleanedUp !== mathContent ? cleanedUp : null;
    const step = {
        stepValue: mathContent, explanation, cleanup, scratchpad: img,
    };
    if (addToHistory) {
        stackAddAction(context, step);
    }

    addNewStep(context, step);
    context.state.displayScratchpad();
    context.scrollToBottom();
    return true;
}

export {
    addStep,
    deleteStep,
    editStep,
    updateStep,
};
