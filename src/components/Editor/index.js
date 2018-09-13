import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import editor from './styles.css';
import { NotificationContainer } from 'react-notifications';
import createAlert from '../../scripts/alert';
import { undoLastAction, clearAll, stackEditAction } from './stack';
import { deleteStep, editStep, updateStep, addStep } from './stepsOperations';
import Locales from '../../strings';
import axios from 'axios';
import ShareModal from '../ShareModal';
import googleAnalytics from '../../scripts/googleAnalytics';
import ConfirmationModal from '../ConfirmationModal';
import { SERVER_URL } from '../../config';

const mathLive = DEBUG_MODE ? require('../../../mathlive/src/mathlive.js')
    : require('../../lib/mathlivedist/mathlive.js');

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
            editedStep: null,
            allowedPalettes: [],
            theActiveMathField: null,
            textAreaValue: "",
            actionsStack: [],
            updateMathFieldMode: false,
            editing: false,
            modalActive: false,
            confirmationModalActive: false,
            shareLink: "http:mathshare.com/exampleShareLink/1",
            editLink: "Not saved yet.",
            readOnly: false,
            displayScratchpad: null
        };

        this.restoreEditorPosition = this.restoreEditorPosition.bind(this);
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

    updateMathEditorRow(mathContent, mathStepNumber, cleanup, scratchpad) {
        let updatedHistory = this.state.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = this.state.textAreaValue;
        updatedHistory[mathStepNumber].cleanup = cleanup;
        updatedHistory[mathStepNumber].scratchpad = scratchpad;
        let oldSolution = this.state.solution;
        oldSolution.steps = updatedHistory;
        this.setState(
            {
                solution: oldSolution,
                textAreaValue: ""
            })
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

    exitUpdate(oldEquation, oldExplanation, cleanup, index, img) {
        this.restoreEditorPosition();
        stackEditAction(this, index, oldEquation, cleanup, oldExplanation, img);
        this.state.displayScratchpad();
    }

    restoreEditorPosition() {
        let updatedMathField = this.state.theActiveMathField;
        var lastStep = this.state.solution.steps[this.state.solution.steps.length - 1];
        updatedMathField.latex(lastStep.cleanup ? lastStep.cleanup : lastStep.stepValue);
        this.setState({
            theActiveMathField: updatedMathField,
            editorPosition: this.countEditorPosition(this.state.solution.steps),
            editing: false
        });
        this.state.theActiveMathField.focus();
    }

    scrollToBottom() {
        document.querySelector("#MainWorkWrapper").scrollTo(0, document.querySelector("#MainWorkWrapper").scrollHeight);
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
            })
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
            if (first[i].stepValue != second[i].stepValue ||
                first[i].explanation != second[i].explanation ||
                first[i].scratchpad != second[i].scratchpad) {
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
            deleteStepCallback={() => deleteStep(this, true)}
            editStepCallback={(stepNumber) => editStep(this, stepNumber)}
            activateMathField={theActiveMathField => this.setState({ theActiveMathField })}
            addStepCallback={(img) => addStep(this, true, img)}
            undoLastActionCallback={() => undoLastAction(this)}
            deleteStepsCallback={() => clearAll(this)}
            updateCallback={(img) => updateStep(this, img)}
            bindDisplayFunction={(f) => this.setState({ displayScratchpad: f })}
            solution={this.state.solution}
            allowedPalettes={this.state.allowedPalettes}
            theActiveMathField={this.state.theActiveMathField}
            textAreaChanged={this.textAreaChanged}
            textAreaValue={this.state.textAreaValue}
            showUndo={this.state.actionsStack.length > 0}
            cancelEditCallback={this.exitUpdate}
            editorPosition={this.state.editorPosition}
            editing={this.state.editing}
            history={this.props.history}
            newProblem={this.id === "newEditor"}
            readOnly={this.state.readOnly} />

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
