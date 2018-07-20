import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MyWork from './components/MyWork';
import MathButton from './components/MyWork/components/MathPalette/components/MathButtonsGroup/components/MathButtonsRow/components/MathButton';
import editor from './styles.css';
import { NotificationContainer } from 'react-notifications';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.id = props.match.params.number;
        var problem = this.getProblemById(props.problems, this.id);
        this.state = {
            math: problem.originalProblem.equation,
            title: problem.originalProblem.annotation,
            steps: problem.history,
            allowedPalettes: props.allowedPalettes,
            theActiveMathField: null,
            undoDeleteStack: [],
            updateMathFieldMode: false
        };

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.undoDeleteStep = this.undoDeleteStep.bind(this);
    }

    componentDidMount() {
        document.onkeydown = HandleKeyDown.bind(this);
    }

    undoDeleteStep() {
        var newStack = this.state.undoDeleteStack;
        var stackEntry = newStack.pop();
        this.setState({undoDeleteStack: newStack});

        if (stackEntry === undefined)
            return;	// shouldn't happen because button is disabled

        if (newStack.length === 0)
            $('#undoDelete').hide();

        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(stackEntry.latex);
        this.setState({theActiveMathField: updatedMathField});
        $('#mathAnnotation').val( stackEntry.annotation );
        this.addStep(true);

        if (this.state.undoDeleteStack.length > 0 && (this.state.undoDeleteStack[this.state.undoDeleteStack.length-1].annotation == '(cleanup)' || stackEntry.clearAll)) {
            this.undoDeleteStep();
        }
    }

    deleteStep(clearAll) {
        // nothing to do if there are no steps
        if (!$('.mathStep:last')) {
            return;
        }

        // get the contents of the last row/step
        let lastStep = this.state.steps[this.state.steps.length - 1];

        // put the contents of the last row/step into the active/current line
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(lastStep.equation);
        this.setState({theActiveMathField: updatedMathField});
        $('#mathAnnotation').val(lastStep.annotation);

        var newStack = this.state.undoDeleteStack;
        newStack.push(
            { latex: this.state.theActiveMathField.latex(),
                annotation: $('#mathAnnotation').val(),
                clearAll: clearAll
            });
        $('#undoDelete').show();
        this.setState({undoDeleteStack: newStack});

        // ok to delete last row now...
        let newSteps = this.state.steps;
        newSteps.pop();
        this.setState({steps: newSteps});

        // read trash button to previous step
        if ($('.mathStep').length > 1) {
            $('.mathStep:last .btn-delete').show();
        }

        //TheActiveMathField.focus();
        if (lastStep.annotation === "(cleanup)") {
            this.deleteStep();
        }
        $('.mathStep:last .btn-edit').show();
        $('#addStep').show();
        $('#updateControls').hide();

    }

    addStep(undoing) {
        let newSteps = this.state.steps;
        let mathContent = this.state.theActiveMathField.latex();
        newSteps.push({"equation":  mathContent , "annotation": $('#mathAnnotation').val()});
        let cleanedUp = MathButton.CleanUpCrossouts(mathContent);
        if (!undoing) {
            if (mathContent !== cleanedUp) {
                newSteps.push({"equation":  cleanedUp , "annotation": "(cleanup)"});
            }
        }
        this.setState({steps: newSteps});
        let updatedMathField = this.state.theActiveMathField;
        updatedMathField.latex(cleanedUp);
        this.setState({theActiveMathField: updatedMathField});
        $('#mathAnnotation').val('');
    }

    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
    }

    render() {
        var myWork;
        var myStepsList;
        var problemHeaderTitle = this.state.title;
        if (this.id != "newEditor") {
            myWork = <MyWork
                allowedPalettes={this.state.allowedPalettes}
                activateMathField={theActiveMathField => this.setState({theActiveMathField})}
                theActiveMathField={this.state.theActiveMathField}
                addStepCallback={this.addStep}
                undoDeleteStepCallback={this.undoDeleteStep}
                lastMathEquation={this.state.steps[this.state.steps.length - 1].equation} />;
            myStepsList = <MyStepsList
                steps={this.state.steps}
                deleteStepCallback={this.deleteStep}
                editStepCallback={this.editStep} />;
            problemHeaderTitle += ": ";
        }

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader math={this.state.math} title={problemHeaderTitle} />
                    <MyStepsHeader />
                    {myStepsList}
                    {myWork}
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
        if ($('#updateStep').is(":visible")) {
            $('#updateStep').click();
        } else {
            NewRowOrRowsAfterCleanup(this.state.theActiveMathField.latex());
        }
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
