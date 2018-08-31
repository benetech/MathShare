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

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.undoLastAction = this.undoLastAction.bind(this);
        this.deleteSteps = this.deleteSteps.bind(this);
        this.editStep = this.editStep.bind(this);
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
            path = `${config.serverUrl}/solution/revision/${this.props.match.params.code}`
        } else {
            path = `${config.serverUrl}/solution/${this.props.match.params.code}/`
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
                    editorPosition: response.data.steps.length -1,
                    theActiveMathField: field,
                    readOnly: this.props.match.params.action == 'view',
                    stepsFromLastSave: JSON.parse(JSON.stringify(response.data.steps))
                });
            })
        $('#undoAction').hide();
        this.scrollToBottom();

        document.onkeydown = HandleKeyDown.bind(this);
    }

    textAreaChanged(text) {
        this.setState({textAreaValue : text});
    }

    editStep(stepNumber) {
        // nothing to do if there are no steps
        let mathStep = $($("#MathHistory").children("#mathStep")[stepNumber]);
    
        if (this.state.updateMathFieldMode === false) {
            $('<div/>', {
                id: "latestMathStepData",
            }).hide().appendTo('#MathHistory');
            $('#latestMathStepData').attr('data-equation', this.state.theActiveMathField.latex());
            $('#latestMathStepData').attr('data-annotation', this.state.textAreaValue);
            //latestMathStepData.data('scratch-pad', ScratchPadPainterro.imageSaver.asDataURL());
        }
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(mathStep.data('equation'));
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: mathStep.data('annotation'),
            editing: true,
            updateMathFieldMode : true},
            this.moveEditorBelowSpecificStep(stepNumber)
        );

        $('#updateStep').unbind();
        $('#updateStep').click(() =>
            this.updateStep(stepNumber)
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
        if (this.state.textAreaValue === '') {
            createAlert('warning', Locales.strings.no_description_warning, 'Warning');
            setTimeout(function(){
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

    updateRowAfterCleanup(mathContent, mathStepNumber) {
        let cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        if (mathContent !== cleanedUp) {
            this.updateMathEditorRow(mathContent, mathStepNumber, false);
            //UpdateMathEditorRow(cleanedUp, mathStepNumber + 1, true); TODO: add cleanup update support
        } else {
            this.updateMathEditorRow(mathContent, mathStepNumber, false);
        }
    }

    updateMathEditorRow(mathContent, mathStepNumber, cleanup) {
        let updatedHistory = this.state.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = cleanup ? Locales.strings.cleanup : this.state.textAreaValue;
        let oldSolution = this.state.solution;
        oldSolution.steps = updatedHistory;
        this.setState({solution : oldSolution})
        $($("#MathHistory").children("#mathStep")[mathStepNumber]).data('equation', mathContent);
        $($("#MathHistory").children("#mathStep")[mathStepNumber]).data('annotation', cleanup ? Locales.strings.cleanup : this.state.textAreaValue);
        mathLive.renderMathInDocument();
    }

    moveEditorBelowSpecificStep(stepNumber) {
        this.setState({editorPosition: stepNumber});
    }

    exitUpdate(oldEquation, oldAnnotation, index) {
        let latestMathStepData = $("#latestMathStepData");
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(latestMathStepData.data('equation'));
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: latestMathStepData.data('annotation'),
            editorPosition: this.state.solution.steps.length - 1,
            editing: false});

        var newStack = this.state.actionsStack;
        newStack.push(
            {   type: "edit",
                latex: oldEquation,
                annotation: oldAnnotation,
                clearAll: false,
                index: index
            });
        $('#undoAction').show();
        this.setState({actionsStack: newStack});

        //applyScratchPadContent(latestMathStepData.data('scratch-pad'));
        latestMathStepData.detach();
    
        this.state.theActiveMathField.focus();
        this.setState({updateMathFieldMode : false});
    }

    scrollToBottom() {
        document.querySelector("#MainWorkWrapper").scrollTo(0, document.querySelector("#MainWorkWrapper").scrollHeight);
    }

    undoLastAction() {
        var newStack = this.state.actionsStack;
        var stackEntry = newStack.pop();
        this.setState({actionsStack: newStack});
        if (newStack.length < 1) {
            $('#undoAction').hide();
        }
        switch(stackEntry.type) {
            case "delete":
                this.undoAction(stackEntry);
                break;
            case "add":
                this.undoAdd();
                break;
            case "edit":
                this.undoEdit(stackEntry);
                break;
            default:
                throw "Unsupported action type";
        }
    }

    undoAction(stackEntry) {
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(stackEntry.latex);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: stackEntry.annotation},
            () => { this.addStep(true);
                    if (stackEntry.clearAll) {
                        this.undoLastAction();
                    }
            }
        );
    }

    undoEdit(stackEntry) {
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(stackEntry.latex);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: stackEntry.annotation},
            () => {
                this.updateMathEditorRow(stackEntry.latex, stackEntry.index, false)
            }
        );
    }

    undoAdd() {
        this.deleteStep(false, false);
    }

    deleteStep(clearAll, addToHistory) {
        // nothing to do if there are no steps
        if (!$('.mathStep:last')) {
            return;
        }

        // get the contents of the last row/step
        let lastStep = this.state.solution.steps[this.state.solution.steps.length - 1];

        // put the contents of the last row/step into the active/current line
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(lastStep.equation);
        this.setState({
            theActiveMathField: updatedMathField,
            textAreaValue: lastStep.annotation
        });

        if (addToHistory) {
            var newStack = this.state.actionsStack;
            newStack.push(
                {    type: "delete",
                    latex: updatedMathField.latex(),
                    annotation: lastStep.annotation,
                    clearAll: clearAll
                });
            $('#undoAction').show();
            this.setState({actionsStack: newStack});
        }

        // ok to delete last row now...
        let newSteps = this.state.solution.steps;
        newSteps.pop();
        this.setState({steps: newSteps});

        // read trash button to previous step
        if ($('.mathStep').length > 1) {
            $('.mathStep:last .btn-delete').show();
        }

        this.state.theActiveMathField.focus();
        if (lastStep.annotation === "(cleanup)") {
            if(addToHistory) {
                this.deleteStep(true, addToHistory);
            } else {
                this.undoLastAction();
            }
        }
        $('.mathStep:last .btn-edit').show();
        $('#addStep').show();
        $('#updateControls').hide();
        this.setState({editorPosition: this.state.solution.steps.length - 1 });
    }

    deleteSteps() {
        if (this.state.solution.steps.length > 1) {
            this.deleteStep(false, true);
            while (this.state.solution.steps.length > 1) {
                this.deleteStep(true, true);
            };
            this.setState({textAreaValue: ""});
        }
    }

    addStep(undoing) {
        if (this.state.textAreaValue === "") {
            createAlert('warning', Locales.strings.no_description_warning, 'Warning');
            setTimeout(function(){
                $('#mathAnnotation').focus();
            }, 6000);
            return;
        }
        let newSteps = this.state.solution.steps;
        let mathContent = this.state.theActiveMathField.latex();
        let annotation = this.state.textAreaValue;
        newSteps.push({"stepValue": mathContent , "explanation": annotation});
        var newStack = this.state.actionsStack;

        let cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        if (mathContent !== cleanedUp && typeof(undoing) != typeof(true)) {
            newStack.push(
            {   type: "add",
                latex: mathContent,
                annotation: annotation,
                clearAll: true
            });
            newSteps.push({"stepValue": cleanedUp, "explanation": Locales.strings.cleanup});
            newStack.push(
            {   type: "add",
                latex: cleanedUp,
                annotation: Locales.strings.cleanup,
                clearAll: true
            });
        } else if (undoing != true){
            newStack.push(
            {   type: "add",
                latex: mathContent,
                annotation: annotation,
                clearAll: false
            });
        }
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(cleanedUp);
        $('#undoAction').show();
        this.setState({actionsStack: newStack});
        var solution = this.state.solution;
        solution.steps = newSteps;
        this.setState({editorPosition: newSteps.length - 1, solution: solution,
            theActiveMathField: updatedMathField,
            textAreaValue: ""});
            
      //  this.setScratchPadContentData(mathStepNewNumber, ScratchPadPainterro.imageSaver.asDataURL())
      //  this.clearScrachPad();
        this.scrollToBottom();
    }

    getApplicationNode() {
        return document.getElementById('root');
    };

    shareProblem() {
        axios.put(`${config.serverUrl}/solution/${this.state.solution.editCode}`, this.state.solution)
        .then(response => {
            this.setState({ 
                shareLink: config.serverUrl + '/problem/view/' + response.data.shareCode,
                modalActive: true 
            });
        }
        )
    };

    saveProblem() {
        googleAnalytics('Save');
        axios.put(`${config.serverUrl}/solution/${this.state.solution.editCode}`, this.state.solution)
            .then(response => {
                this.setState({
                    editLink: config.serverUrl + '/problem/edit/' + this.state.solution.editCode,
                    stepsFromLastSave: JSON.parse(JSON.stringify(this.state.solution.steps))
                })
                createAlert('success', Locales.strings.problem_saved_success_message, Locales.strings.success);
            }
        )
    };

    goBack() {
        if(!this.compareStepArrays(this.state.solution.steps, this.state.stepsFromLastSave)) {
            this.activateConfirmationModal();
        } else {
            this.props.history.goBack();
        }
    }

    compareStepArrays(first, second) {
        if(first.length != second.length) {
            return false;
        }
        for(var i = 0; i < first.length; i++) {
            if(first[i].stepValue != second[i].stepValue || first[i].explanation != second[i].explanation) {
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
        const modal = this.state.modalActive ? <ShareModal shareLink={this.state.shareLink} deactivateModal={this.deactivateModal}/> : null;

        const confirmationModal = this.state.confirmationModalActive ? 
        <ConfirmationModal redButtonCallback={this.confirmationModalDiscardCallback} greenButtonCallback={this.confirmationModalSaveCallback}
            deactivateModal={this.deactivateConfirmationModal} title={Locales.strings.confirmation_modal_unsaved_title}
            redButtonLabel={Locales.strings.discard_changes} greenButtonLabel={Locales.strings.save_changes}/>
        : null;

        var myStepsList;
        var problemHeaderTitle = this.state.solution.problem.title;
            myStepsList = <MyStepsList
                solution={this.state.solution}
                deleteStepCallback={this.deleteStep}
                editStepCallback={this.editStep}
                allowedPalettes={this.state.allowedPalettes}
                activateMathField={theActiveMathField => this.setState({theActiveMathField})}
                theActiveMathField={this.state.theActiveMathField}
                textAreaChanged={this.textAreaChanged}
                textAreaValue={this.state.textAreaValue}
                addStepCallback={this.addStep}
                undoLastActionCallback={this.undoLastAction}
                deleteStepsCallback={this.deleteSteps}
                cancelEditCallback={this.exitUpdate}
                editorPosition={this.state.editorPosition}
                editing={this.state.editing}
                updateStepCallback={this.updateStep}
                history={this.props.history} 
                newProblem = {this.id === "newEditor"}
                readOnly={this.state.readOnly} />
            problemHeaderTitle += ": ";

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    {confirmationModal}
                    {modal}
                    <ProblemHeader math={JSON.parse(JSON.stringify(this.state.solution.problem.text))} title={problemHeaderTitle} 
                        shareProblem={this.shareProblem} scratchpad={this.state.solution.problem.scratchpad}
                        saveProblem={this.saveProblem} readOnly={this.state.readOnly} 
                        editLink={JSON.parse(JSON.stringify(this.state.editLink))} goBack={this.goBack} />
                    <MyStepsHeader readOnly={this.state.readOnly} />
                    {myStepsList}
                    <div ref={el => { this.el = el; }} style={{height: 50}} />
                </main>
            </div>
        );
    }
}

function HandleKeyDown(event)
{
    var keyShortcuts = new Map(JSON.parse(sessionStorage.keyShortcuts));
    if (event.shiftKey && this.state.theActiveMathField.selectionIsCollapsed()) {
        // if an insertion cursor, extend the selection unless we are at an edge
        if (event.key === 'Backspace' && !this.state.theActiveMathField.selectionAtStart()) {
            this.state.theActiveMathField.perform('extendToPreviousChar');

        } else if (event.key === 'Delete' && !this.state.theActiveMathField.selectionAtEnd()) {
            this.state.theActiveMathField.perform('extendToNextChar');
        }
    }
    if (event.shiftKey && event.key === 'Enter' && $('#mathAnnotation').val() !== '') {
        event.preventDefault();
        if ($('#updateStep').is(":visible")) {
            $('#updateStep').click();
        } else {
            this.addStep(false);
        }
    }
    if (event.shiftKey && event.key === 'Backspace' && this.state.actionsStack.length > 0) {
        event.preventDefault();
        this.undoLastAction();
    }

    var keys = [];
    if (event.shiftKey) {
        keys.push("Shift");
    }
    if (event.ctrlKey) {
        keys.push("Ctrl");
    }
    keys.push(event.key);
    var id = keyShortcuts.get(keys.sort().join(''));
    if (id) {
        $("#" + id).click();
    }
}
