import {
    stackDeleteAction,
    stackAddAction,
} from './stackOperations';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import {
    alertSuccess,
    // alertWarning,
} from '../../scripts/alert';
import Locales from '../../strings';
import googleAnalytics from '../../scripts/googleAnalytics';
import { countEditorPosition } from '../../redux/problem/helpers';

function checkIfDescriptionIsRequired(problemStore, problemList) {
    const isSolutionView = /#\/app\/problem\/edit\/[A-Z0-9]*/.exec(window.location.hash);
    const isProblemEditView = /#\/app\/problemSet\/edit\/[A-Z0-9]*\/[0-9]*/.exec(window.location.hash);
    if (isSolutionView) {
        const { solution } = problemStore;
        return (solution && !solution.optionalExplanations);
    }
    if (isProblemEditView) {
        const { set } = problemList;
        return (set && !set.optionalExplanations);
    }
    return true;
}

function addNewStep(context, step) {
    const { updateProblemStore, problemStore, problemList } = context.props;
    googleAnalytics('Add new step');
    const newSteps = problemStore.solution.steps;
    newSteps.push(step);
    const updatedMathField = problemList.theActiveMathField;
    updatedMathField.$latex(step.cleanup);

    const solution = problemStore.solution;
    solution.steps = newSteps;
    updateProblemStore({
        editorPosition: countEditorPosition(newSteps),
        solution,
        theActiveMathField: updatedMathField,
        textAreaValue: '',
        isUpdated: true,
    });
}

function deleteLastStep(context) {
    const { updateProblemStore, problemStore } = context.props;
    googleAnalytics('Delete last step');
    const newSteps = problemStore.solution.steps;
    newSteps.pop();
    updateProblemStore({
        steps: newSteps,
        editorPosition: countEditorPosition(problemStore.solution.steps),
        isUpdated: true,
    });
    context.restoreEditorPosition();
}

function deleteStep(context, addToHistory) {
    const { problemStore } = context.props;
    googleAnalytics('Delete step');
    const steps = problemStore.solution.steps;
    const lastStep = steps[steps.length - 1];

    if (addToHistory) {
        stackDeleteAction(context, lastStep);
    }

    problemStore.displayScratchpad();
    deleteLastStep(context);
}

function editStep(context, stepNumber) {
    const { problemStore, problemList, updateProblemStore } = context.props;
    googleAnalytics('Edit step');
    const mathStep = problemStore.solution.steps[stepNumber - 1];
    const updatedMathField = problemList.theActiveMathField;
    updatedMathField.$latex(mathStep.stepValue);
    problemStore.displayScratchpad(mathStep.scratchpad);
    updateProblemStore({
        editedStep: stepNumber - 1,
        theActiveMathField: updatedMathField,
        textAreaValue: mathStep.explanation,
        editing: true,
        updateMathFieldMode: true,
        isUpdated: true,
    });
    context.moveEditorBelowSpecificStep(stepNumber);
}

function updateStep(context, img) {
    const { updateProblemStore, problemStore, problemList } = context.props;
    googleAnalytics('Edit step');
    const index = problemStore.editedStep;

    if (checkIfDescriptionIsRequired(problemStore, problemList) && problemStore.textAreaValue === '') {
        // alertWarning(Locales.strings.no_description_warning, 'Warning');
        $('#mathAnnotation').tooltip('show');
        setTimeout(() => {
            $('#mathAnnotation').focus();
        }, 6000);
        return;
    }
    const mathStep = Object.assign({}, problemStore.solution.steps[index]);
    const cleanedup = MathButton.CleanUpCrossouts(problemList.theActiveMathField.$latex());
    const cleanup = cleanedup === problemList.theActiveMathField.$latex() ? null : cleanedup;
    context.updateMathEditorRow(problemList.theActiveMathField.$latex(),
        problemStore.textAreaValue, index, cleanup, img);
    context.cancelEditCallback(mathStep.stepValue, mathStep.explanation,
        mathStep.cleanup, index, mathStep.scratchpad);
    alertSuccess(Locales.strings.successfull_update_message, 'Success');
    problemStore.displayScratchpad();
    updateProblemStore({
        isUpdated: true,
    });
}

function addStep(context, addToHistory, img) {
    const { problemStore, problemList, updateProblemStore } = context.props;
    if (checkIfDescriptionIsRequired(problemStore, problemList) && (!problemStore.textAreaValue || problemStore.textAreaValue === '' || $.trim(problemStore.textAreaValue).length === 0)) {
        // alertWarning(Locales.strings.no_description_warning, 'Warning');
        $('#mathAnnotation').tooltip('show');
        setTimeout(() => {
            $('#mathAnnotation').focus();
        }, 6000);
        return false;
    }
    const mathContent = problemList.theActiveMathField.$latex();
    const explanation = problemStore.textAreaValue;
    const cleanedUp = MathButton.CleanUpCrossouts(mathContent);
    const cleanup = cleanedUp !== mathContent ? cleanedUp : null;
    const step = {
        stepValue: mathContent,
        explanation,
        cleanup,
        scratchpad: img,
    };
    if (addToHistory) {
        stackAddAction(context, step);
    }

    addNewStep(context, step);
    problemStore.displayScratchpad();
    context.scrollToBottom();
    updateProblemStore({
        isUpdated: true,
    });
    return true;
}

export {
    addStep,
    checkIfDescriptionIsRequired,
    deleteStep,
    editStep,
    updateStep,
};
