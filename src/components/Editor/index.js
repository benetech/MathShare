import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import editor from './styles.css';
import { NotificationContainer } from 'react-notifications';
import createAlert from '../../scripts/alert';
import Locales from '../../strings';
import axios from 'axios';
import config from '../../../package.json';
import ShareModal from '../ShareModal';
import googleAnalytics from '../../scripts/googleAnalytics';
import ConfirmationModal from '../ConfirmationModal';
import { SERVER_URL } from '../../config';

const mathLive = DEBUG_MODE ? require('../../../mathlive/src/mathlive.js')
    : require('../../lib/mathlivedist/mathlive.js');

const DELETE = "delete";
const CLEAR_ALL = "clear all";
const ADD = "add";
const EDIT = "edit";

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: {
                problem: {
                    title: Locales.strings.loading,
                    text: Locales.strings.loading,
                },
                steps: [
                    {
                        stepValue: "",
                        explanation: Locales.strings.loading
                    }
                ],
                editCode: null
            },
            stepsFromLastSave: [
                {
                    stepValue: "",
                    explanation: Locales.strings.loading
                }
            ],
            editorPosition: 0,
            allowedPalettes: props.allowedPalettes,
            theActiveMathField: null,
            textAreaValue: "",
            actionsStack: [],
            updateMathFieldMode: false,
            editing: false,
            modalActive: false,
            confirmationModalActive: false,
            shareLink: "http:mathshare.com/exampleShareLink/1",
            editLink: "Not saved yet.",
            readOnly: false
        };

        this.stackDeleteAction = this.stackDeleteAction.bind(this);
        this.deleteLastStep = this.deleteLastStep.bind(this);
        this.stackAddAction = this.stackAddAction.bind(this);
        this.addNewStep = this.addNewStep.bind(this);
        this.addStep = this.addStep.bind(this);
        this.restoreEditorPosition = this.restoreEditorPosition.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.undoLastAction = this.undoLastAction.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.editStep = this.editStep.bind(this);
        this.deleteCleanupOf = this.deleteCleanupOf.bind(this);
        this.updateStep = this.updateStep.bind(this);
        this.exitUpdate = this.exitUpdate.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.getApplicationNode = this.getApplicationNode.bind(this);
        this.shareProblem = this.shareProblem.bind(this);
        this.saveProblem = this.saveProblem.bind(this);
        this.deactivateModal = this.deactivateModal.bind(this);
        this.deactivateConfirmationModal = this.deactivateConfirmationModal.bind(this);
        this.activateConfirmationModal = this.activateConfirmationModal.bind(this);
        this.goBack = this.goBack.bind(this);
        this.confirmationModalSaveCallback = this.confirmationModalSaveCallback.bind(this);
        this.confirmationModalDiscardCallback = this.confirmationModalDiscardCallback.bind(this);
    }

    componentDidMount() {
        var path;
        if (this.props.match.params.action == "view") {
            path = `${SERVER_URL}/solution/revision/${this.props.match.params.code}`
        } else {
            path = `${SERVER_URL}/solution/${this.props.match.params.code}/`
        }
        axios.get(path)
            .then(response => {
                var solution = {
                    problem: response.data.problem,
                    steps: response.data.steps,
                    editCode: response.data.editCode
                }
                let field = this.state.theActiveMathField;
                field.latex(response.data.steps[response.data.steps.length - 1].stepValue);
                this.setState({
                    solution,
                    editorPosition: this.countEditorPosition(response.data.steps),
                    theActiveMathField: field,
                    readOnly: this.props.match.params.action == 'view',
                    stepsFromLastSave: JSON.parse(JSON.stringify(response.data.steps)),
                    allowedPalettes: response.data.palettes
                });
            })
        this.scrollToBottom();
    }

    textAreaChanged(text) {
        this.setState({ textAreaValue: text });
    }

    editStep(stepNumber) {
        let mathStep = this.state.solution.steps[stepNumber - 1];
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(mathStep.stepValue);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: mathStep.explanation,
            editing: true,
            updateMathFieldMode: true
        },
            this.moveEditorBelowSpecificStep(stepNumber)
        );

        /*
        TODO: restore, while adding support for scratchpad on the backend
        var content = this.setScratchPadContentData(stepNumber);
        if (content) {
            this.applyScratchPadContent(content);
        } else {
            this.clearScrachPad();
        }*/
    }

    updateStep() {
        var index = this.state.editorPosition;
        this.deleteCleanupOf(index);
        
        if (this.state.textAreaValue === '') {
            createAlert('warning', Locales.strings.no_description_warning, 'Warning');
            setTimeout(function () {
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }
        let mathStep = $($("#MathHistory").children("#mathStep")[index]);
        let oldAnnotation = mathStep.data('annotation');
        let oldEquation = mathStep.data('equation');

        this.updateRowAfterCleanup(this.state.theActiveMathField.latex(), index);
        this.exitUpdate(oldEquation, oldAnnotation, index);
        createAlert('success', Locales.strings.successfull_update_message, 'Success');
    }

    deleteCleanupOf(index) {
        var steps = this.state.solution.steps;
        if (steps[index].cleanup) {
            steps[index].cleanup = null;
        }
        this.setState({steps});
    }
    
    updateRowAfterCleanup(mathContent, mathStepNumber) {
        let cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        if (mathContent !== cleanedUp) {
            this.updateMathEditorRow(mathContent, mathStepNumber, cleanedUp);
        } else {
            this.updateMathEditorRow(mathContent, mathStepNumber, false);
        }
    }

    updateMathEditorRow(mathContent, mathStepNumber, cleanup) {
        let updatedHistory = this.state.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = this.state.textAreaValue;
        updatedHistory[mathStepNumber].cleanup =  cleanup;
        let oldSolution = this.state.solution;
        oldSolution.steps = updatedHistory;
        this.setState({ solution: oldSolution })
        $($("#MathHistory").children("#mathStep")[mathStepNumber]).data('equation', mathContent);
        $($("#MathHistory").children("#mathStep")[mathStepNumber]).data('annotation', cleanup ? Locales.strings.cleanup : this.state.textAreaValue);
        mathLive.renderMathInDocument();
    }

    moveEditorBelowSpecificStep(stepNumber) {
        var steps = this.state.solution.steps.slice();
        var leftPartOfSteps = steps.splice(0, stepNumber);
        var editorPosition = this.countEditorPosition(leftPartOfSteps);
        if (leftPartOfSteps[leftPartOfSteps.length - 1].cleanup) {
            editorPosition--;
        }
        this.setState({ editorPosition });
    }

    exitUpdate(oldEquation, oldExplanation, index) {
        this.restoreEditorPosition();

        var newStack = this.state.actionsStack;
        var oldStep = { "id": index, "equation": oldEquation, "explanation": oldExplanation };
        newStack.push({
            type: EDIT,
            step: oldStep
        });

        this.setState({
            actionsStack: newStack,
            updateMathFieldMode: false
        });
    }

    restoreEditorPosition() {
        let updatedMathField = this.state.theActiveMathField;
        var lastStep = this.state.solution.steps[this.state.solution.steps.length -1];
        updatedMathField.latex(lastStep.stepValue);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: "",
            editorPosition: this.countEditorPosition(this.state.solution.steps),
            editing: false
        });
        this.state.theActiveMathField.focus();
    }

    scrollToBottom() {
        document.querySelector("#MainWorkWrapper").scrollTo(0, document.querySelector("#MainWorkWrapper").scrollHeight);
    }

    undoLastAction() {
        var newStack = this.state.actionsStack;
        var stackEntry = newStack.pop();
        this.setState({ actionsStack: newStack });
        switch (stackEntry.type) {
            case DELETE:
                this.undoDelete(stackEntry);
                break;
            case CLEAR_ALL:
                this.undoClearAll(stackEntry);
                break;
            case ADD:
                this.undoAdd();
                break;
            case EDIT:
                this.undoEdit(stackEntry);
                break;
            default:
                throw "Unsupported action type";
        }
    }

    undoClearAll(stackEntry) {
        var solution = this.state.solution;
        solution.steps = stackEntry.steps;
        this.setState({ solution });
    }

    undoDelete(stackEntry) {
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(stackEntry.step.stepValue);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: stackEntry.step.explanation
        }, this.addStep);
    }

    undoEdit(stackEntry) {
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(stackEntry.step.stepValue);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: stackEntry.step.explanation
        }, () => {
            this.updateMathEditorRow(stackEntry.step.stepValue, stackEntry.step.id, false)
        });
    }

    undoAdd() {
        this.deleteStep();
    }

    deleteStep(addToHistory) {
        var steps = this.state.solution.steps;
        var lastStep = steps[steps.length - 1];

        if (addToHistory) {
            this.stackDeleteAction(lastStep);
        }

        this.deleteLastStep();
    }

    stackDeleteAction(step) {
        var actionsStack = this.state.actionsStack;
        actionsStack.push({
            type: DELETE,
            step: step
        });
        this.setState({ actionsStack });
    }

    deleteLastStep() {
        let newSteps = this.state.solution.steps;
        var deletedStep = newSteps.pop();
        if (deletedStep.cleanup) {
            newSteps.pop();
        }
        this.setState({
            steps: newSteps,
            editorPosition: this.countEditorPosition(this.state.solution.steps)
        }, this.restoreEditorPosition);
    }

    clearAll() {
        var stack = this.state.actionsStack;
        var steps = this.state.solution.steps;
        stack.push({
            type: CLEAR_ALL,
            steps: steps
        });

        var solution = this.state.solution;
        var firstStep = solution.steps[0];
        solution.steps = [];
        solution.steps.push(firstStep);
        this.setState({
            textAreaValue: "",
            actionsStack: stack,
            solution: solution
        });
    }

    countCleanups(steps) {
        var cleanups = 0;
        steps.forEach(function (step) {
            if (step.cleanup) {
                cleanups++;
            }
        })
        return cleanups;
    }

    countEditorPosition(steps) {
        return steps.length + this.countCleanups(steps) - 1;
    }

    addStep(addToHistory) {
        if (!this.state.textAreaValue || this.state.textAreaValue === "") {
            createAlert('warning', Locales.strings.no_description_warning, 'Warning');
            setTimeout(function () {
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }
        let mathContent = this.state.theActiveMathField.latex();
        let explanation = this.state.textAreaValue;
        var cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        let cleanup = cleanedUp != mathContent ? cleanedUp : null;
        var step = { "stepValue": mathContent, "explanation": explanation, "cleanup": cleanup };

        if (addToHistory) {
            this.stackAddAction(step);
        }

        this.addNewStep(step);
        this.scrollToBottom();
    }

    stackAddAction(step) {
        var actionsStack = this.state.actionsStack;
        actionsStack.push({
            type: ADD,
            step: step
        });
        this.setState({ actionsStack });
    }

    addNewStep(step) {
        let newSteps = this.state.solution.steps;
        newSteps.push(step);
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(step.cleanup);

        var solution = this.state.solution;
        solution.steps = newSteps;
        this.setState({
            editorPosition: this.countEditorPosition(newSteps),
            solution: solution,
            theActiveMathField: updatedMathField,
            textAreaValue: ""
        });
    }

    getApplicationNode() {
        return document.getElementById('root');
    };

    shareProblem() {
        axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
            .then(response => {
                this.setState({
                    shareLink: SERVER_URL + '/problem/view/' + response.data.shareCode,
                    modalActive: true
                });
            }
            )
    };

    saveProblem() {
        googleAnalytics('Save');
        axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
            .then(response => {
                this.setState({
                    editLink: SERVER_URL + '/problem/edit/' + this.state.solution.editCode,
                    stepsFromLastSave: JSON.parse(JSON.stringify(this.state.solution.steps))
                })
                createAlert('success', Locales.strings.problem_saved_success_message, Locales.strings.success);
            }
            )
    };

    goBack() {
        if (!this.compareStepArrays(this.state.solution.steps, this.state.stepsFromLastSave)) {
            this.activateConfirmationModal();
        } else {
            this.props.history.goBack();
        }
    }

    compareStepArrays(first, second) {
        if (first.length != second.length) {
            return false;
        }
        for (var i = 0; i < first.length; i++) {
            if (first[i].stepValue != second[i].stepValue || first[i].explanation != second[i].explanation) {
                return false;
            }
        }
        return true;
    }

    deactivateModal() {
        this.setState({ modalActive: false });
    };

    deactivateConfirmationModal() {
        this.setState({ confirmationModalActive: false });
    };

    activateConfirmationModal() {
        this.setState({ confirmationModalActive: true });
    };

    confirmationModalSaveCallback() {
        this.deactivateConfirmationModal();
        this.saveProblem();
    }

    confirmationModalDiscardCallback() {
        this.deactivateConfirmationModal();
        this.props.history.goBack();
    }

    render() {
        const modal = this.state.modalActive ? <ShareModal shareLink={this.state.shareLink} deactivateModal={this.deactivateModal} /> : null;

        const confirmationModal = this.state.confirmationModalActive ?
            <ConfirmationModal redButtonCallback={this.confirmationModalDiscardCallback} greenButtonCallback={this.confirmationModalSaveCallback}
                deactivateModal={this.deactivateConfirmationModal} title={Locales.strings.confirmation_modal_unsaved_title}
                redButtonLabel={Locales.strings.discard_changes} greenButtonLabel={Locales.strings.save_changes} />
            : null;

        var myStepsList = <MyStepsList
            solution={this.state.solution}
            deleteStepCallback={() => this.deleteStep(true)}
            editStepCallback={this.editStep}
            allowedPalettes={this.state.allowedPalettes}
            activateMathField={theActiveMathField => this.setState({ theActiveMathField })}
            theActiveMathField={this.state.theActiveMathField}
            textAreaChanged={this.textAreaChanged}
            textAreaValue={this.state.textAreaValue}
            addStepCallback={() => this.addStep(true)}
            undoLastActionCallback={this.undoLastAction}
            deleteStepsCallback={this.clearAll}
            showUndo={this.state.actionsStack.length > 0}
            cancelEditCallback={this.exitUpdate}
            editorPosition={this.state.editorPosition}
            editing={this.state.editing}
            updateCallback={this.updateStep}
            history={this.props.history}
            newProblem={this.id === "newEditor"}
            readOnly={this.state.readOnly}
            undoLastAction={this.undoLastAction} />

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    {confirmationModal}
                    {modal}
                    <ProblemHeader math={JSON.parse(JSON.stringify(this.state.solution.problem.text))} title={this.state.solution.problem.title}
                        shareProblem={this.shareProblem} scratchpad={this.state.solution.problem.scratchpad}
                        saveProblem={this.saveProblem} readOnly={this.state.readOnly}
                        editLink={JSON.parse(JSON.stringify(this.state.editLink))} goBack={this.goBack} />
                    <MyStepsHeader readOnly={this.state.readOnly} />
                    {myStepsList}
                    <div ref={el => { this.el = el; }} style={{ height: 50 }} />
                </main>
            </div>
        );
    }
}
