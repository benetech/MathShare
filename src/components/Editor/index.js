import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import editor from './styles.css';
import {NotificationContainer} from 'react-notifications';
import mathLive from '../../../src/lib/mathlivedist/mathlive.js';
import createAlert from '../../scripts/alert';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.id = props.match.params.number;
        var problem = this.getProblemById(props.problems, this.id);
        this.state = {
            math: problem.originalProblem.equation,
            title: problem.originalProblem.annotation,
            steps: problem.history,
            editorPosition: problem.history.length - 1,
            allowedPalettes: props.allowedPalettes,
            theActiveMathField: null,
            textAreaValue: "",
            actionsStack: [],
            updateMathFieldMode: false,
            editing: false
        };

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.undoLastAction = this.undoLastAction.bind(this);
        this.deleteSteps = this.deleteSteps.bind(this);
        this.editStep = this.editStep.bind(this);
        this.updateStep = this.updateStep.bind(this);
        this.exitUpdate = this.exitUpdate.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
    }

    textAreaChanged(event) {
        this.setState({textAreaValue : event.target.value});
    }

    componentDidMount() {
        $('#undoDelete').hide();
    }

    editStep(stepNumber) {
        // nothing to do if there are no steps
        let mathStep = $($("#MathHistory").children()[stepNumber]);
    
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
        
        var content = this.setScratchPadContentData(stepNumber);
        if (content) {
            this.applyScratchPadContent(content);
        } else {
            this.clearScrachPad();
        }
    }

    //TODO: lift sratchpadpainterro up to here from my workeditorbuttons so we can use it
    clearScrachPad() {
       // ScratchPadPainterro.clearBackground();
       // ScratchPadPainterro.worklog.current = null;
        // it is because Painterro displays a modal if we want to replace an existing ScratchPad content
       // ScratchPadPainterro.worklog.clean = true;
    }

    setScratchPadContentData(stepNumber, newContent) {
       // let mathStep = $('.mathStep:eq('+ (stepNumber - 1) +')');
       // mathStep.data('scratch-pad', newContent);
    }
    
    getScratchPadContentData(stepNumber) {
        //let mathStep = $('.mathStep:eq('+ (stepNumber - 1) +')');
        //return mathStep.data('scratch-pad');
    }
    
    applyScratchPadContent(content) {
       // ClearScrachPad();
        //ScratchPadPainterro.show(content);
    }

    updateStep(index) {
        if (this.state.textAreaValue === '') {
            createAlert('warning', 'Please provide a description of your work.', 'Warning');
            $('#mathAnnotation').focus();
            return;
        }
        let mathStep = $($("#MathHistory").children()[index]);
        let oldAnnotation = mathStep.data('annotation');
        let oldEquation = mathStep.data('equation');

        this.updateRowAfterCleanup(this.state.theActiveMathField.latex(), index);
        this.exitUpdate(oldEquation, oldAnnotation, index);
        createAlert('success', 'The step has been updated.', 'Success');
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
        let updatedHistory = this.state.steps;
        updatedHistory[mathStepNumber].equation = mathContent;
        updatedHistory[mathStepNumber].annotation = cleanup ? '(cleanup)' : this.state.textAreaValue;
        this.setState({steps : updatedHistory})
        $($("#MathHistory").children()[mathStepNumber]).data('equation', mathContent);
        $($("#MathHistory").children()[mathStepNumber]).data('annotation', cleanup ? '(cleanup)' : this.state.textAreaValue);
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
            editorPosition: this.state.steps.length - 1,
            editing: false});

        var newStack = this.state.actionsStack;
        newStack.push(
            {   type: "edit",
                latex: oldEquation,
                annotation: oldAnnotation,
                clearAll: false,
                index: index
            });
        $('#undoDelete').show();
        this.setState({actionsStack: newStack});

        //applyScratchPadContent(latestMathStepData.data('scratch-pad'));
        latestMathStepData.detach();
    
        this.state.theActiveMathField.focus();
        this.setState({updateMathFieldMode : false});
    }

    componentDidMount() {
        document.onkeydown = HandleKeyDown.bind(this);
    }

    scrollToBottom() {
        document.querySelector("#MainWorkWrapper").scrollTo(0,document.querySelector("#MainWorkWrapper").scrollHeight);
    }

    undoLastAction() {
        var newStack = this.state.actionsStack;
        var stackEntry = newStack.pop();
        this.setState({actionsStack: newStack});
        if (newStack.length < 1) {
            $('#undoDelete').hide();
        }
        switch(stackEntry.type) {
            case "delete":
                this.undoDelete(stackEntry);
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

    undoDelete(stackEntry) {
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
        let lastStep = this.state.steps[this.state.steps.length - 1];

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
            $('#undoDelete').show();
            this.setState({actionsStack: newStack});
        }

        // ok to delete last row now...
        let newSteps = this.state.steps;
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
        this.setState({editorPosition: this.state.steps.length - 1 });
    }

    deleteSteps() {
        this.deleteStep(false, true);
        while (this.state.steps.length > 1) {
            this.deleteStep(true, true);
        };
        this.setState({textAreaValue: ""});
    }

    addStep(undoing) {
        if (this.state.textAreaValue === "") {
            createAlert('warning', 'Please provide a description of your work.', 'Warning');
            $('#mathAnnotation').focus();
            return;
        }
        let newSteps = this.state.steps;
        let mathContent = this.state.theActiveMathField.latex();
        let annotation = this.state.textAreaValue;
        newSteps.push({"equation":  mathContent , "annotation": annotation});
        var newStack = this.state.actionsStack;

        let cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        if (mathContent !== cleanedUp && typeof(undoing) != typeof(true)) {
            newStack.push(
            {   type: "add",
                latex: mathContent,
                annotation: annotation,
                clearAll: true
            });
            newSteps.push({"equation": cleanedUp, "annotation": "(cleanup)"});
            newStack.push(
            {   type: "add",
                latex: cleanedUp,
                annotation: "(cleanup)",
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
        $('#undoDelete').show();
        this.setState({actionsStack: newStack});
        this.setState({editorPosition: newSteps.length - 1, steps: newSteps,
            theActiveMathField: updatedMathField,
            textAreaValue: ""});

      //  this.setScratchPadContentData(mathStepNewNumber, ScratchPadPainterro.imageSaver.asDataURL())
      //  this.clearScrachPad();
        this.scrollToBottom();
    }

    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
    }

    render() {
        var myStepsList;
        var problemHeaderTitle = this.state.title;
        if (this.id != "newEditor") {
            myStepsList = <MyStepsList
                steps={this.state.steps}
                deleteStepCallback={this.deleteStep}
                editStepCallback={this.editStep}
                allowedPalettes={this.state.allowedPalettes}
                activateMathField={theActiveMathField => this.setState({theActiveMathField})}
                theActiveMathField={this.state.theActiveMathField}
                textAreaChanged={this.textAreaChanged}
                textAreaValue={this.state.textAreaValue}
                addStepCallback={this.addStep}
                undoLastActionCallback={this.undoLastAction}
                lastMathEquation={this.state.steps[this.state.steps.length - 1].equation} 
                deleteStepsCallback={this.deleteSteps}
                cancelEditCallback={this.exitUpdate}
                editorPosition={this.state.editorPosition}
                editing={this.state.editing}
                history={this.props.history} 
                savedProblem={this.props.savedProblem}/>;
            problemHeaderTitle += ": ";
        }

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader math={this.state.math} title={problemHeaderTitle} />
                    <MyStepsHeader />
                    {myStepsList}
                    <div ref={el => { this.el = el; }} style={{height: 50}}/>
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
