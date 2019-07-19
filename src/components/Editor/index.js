import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntercomAPI } from 'react-intercom';
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import NotFound from '../NotFound';
import editor from './styles.scss';
import { stackEditAction } from './stackOperations';
import { clearAll, undoLastAction } from './stack';
import {
    deleteStep, editStep, updateStep, addStep,
} from './stepsOperations';
import problemActions from '../../redux/problem/actions';
import { compareStepArrays, countEditorPosition } from '../../redux/problem/helpers';
import Locales from '../../strings';
import googleAnalytics from '../../scripts/googleAnalytics';
import exampleProblem from './example.json';
import scrollTo from '../../scripts/scrollTo';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../mathlive/src/mathlive.js').default
    : require('../../lib/mathlivedist/mathlive.js');

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            actionsStack: [],
        };

        this.restoreEditorPosition = this.restoreEditorPosition.bind(this);
        this.cancelEditCallback = this.cancelEditCallback.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.getApplicationNode = this.getApplicationNode.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    componentWillMount() {
        const { match } = this.props;
        if (match.params.action === 'view') {
            googleAnalytics('View a Problem: Teacher');
        } else if (match.params.action === 'edit') {
            googleAnalytics('View a Problem: Student');
            IntercomAPI('trackEvent', 'work-a-problem');
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onUnload);
        if (this.props.example) {
            this.props.loadExampleProblem(exampleProblem);
        } else {
            const { action, code } = this.props.match.params;
            this.props.loadProblem(action, code);
        }
        this.setState({
            actionsStack: [],
        });
        const mathEditor = document.getElementById('mathEditorActive');
        if (mathEditor && mathEditor.mathfield) {
            const { undoManager } = mathEditor.mathfield;
            if (undoManager) {
                undoManager.reset();
            }
        }
        this.scrollToBottom();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onUnload);
    }

    onUnload(event) {
        const { editLink, solution, stepsFromLastSave } = this.props.problemStore;
        const { location } = this.props;
        if (location.pathname.indexOf('/app/problem/view') === '0' // check if the open view is readonly
            || (editLink !== Locales.strings.not_saved_yet
                && compareStepArrays(solution.steps, stepsFromLastSave))) {
            return null;
        }
        const e = event || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
            e.preventDefault();
            e.returnValue = 'Sure?';
        }

        // For Safari
        return 'Sure?';
    }

    scrollToBottom = () => {
        scrollTo('MainWorkWrapper', 'mainWorkAreaFooter');
    }

    countCleanups = (steps) => {
        let cleanups = 0;
        steps.forEach((step) => {
            if (step.cleanup) {
                cleanups += 1;
            }
        });
        return cleanups;
    }

    getApplicationNode = () => document.getElementById('root')

    textAreaChanged(text) {
        this.props.updateProblemStore({ textAreaValue: text });
    }

    countEditorPosition(steps) {
        return steps.length + this.countCleanups(steps) - 1;
    }

    restoreEditorPosition() {
        const { problemStore, problemList } = this.props;
        const updatedMathField = problemList.theActiveMathField;
        const lastStep = problemStore.solution.steps[problemStore.solution.steps.length - 1];
        updatedMathField.latex(lastStep.cleanup ? lastStep.cleanup : lastStep.stepValue);
        this.props.updateProblemStore({
            theActiveMathField: updatedMathField,
            editorPosition: countEditorPosition(problemStore.solution.steps),
            editing: false,
        });
        problemList.theActiveMathField.focus();
    }

    cancelEditCallback(oldEquation, oldExplanation, cleanup, index, img) {
        this.restoreEditorPosition();
        stackEditAction(this, index, oldEquation, cleanup, oldExplanation, img);
        this.props.problemStore.displayScratchpad();
    }

    moveEditorBelowSpecificStep(stepNumber) {
        const steps = this.props.problemStore.solution.steps.slice();
        const leftPartOfSteps = steps.splice(0, stepNumber);
        let editorPosition = this.countEditorPosition(leftPartOfSteps);
        if (leftPartOfSteps[leftPartOfSteps.length - 1].cleanup) {
            editorPosition -= 1;
        }
        this.props.updateProblemStore({ editorPosition });
    }

    updateMathEditorRow(mathContent, mathAnnotation, mathStepNumber, cleanup, scratchpad) {
        const { problemStore } = this.props;
        const updatedHistory = problemStore.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = mathAnnotation;
        updatedHistory[mathStepNumber].cleanup = cleanup;
        updatedHistory[mathStepNumber].scratchpad = scratchpad;
        const oldSolution = problemStore.solution;
        oldSolution.steps = updatedHistory;
        this.props.updateProblemStore({
            solution: oldSolution,
            textAreaValue: '',
            editorPosition: countEditorPosition(problemStore.solution.steps),
        });
        mathLive.renderMathInDocument();
    }

    activateMathField(theActiveMathField) {
        const field = theActiveMathField;
        this.props.setActiveMathFieldInProblem(field);
        if (this.props.example) {
            field.latex(exampleProblem.steps[exampleProblem.steps.length - 1].stepValue);
        }
    }

    render() {
        const { problemStore, problemList } = this.props;
        if (problemStore.notFound) {
            return <NotFound />;
        }

        const myStepsList = (
            <MyStepsList
                {...this}
                {...this.props}
                {...problemStore}
                theActiveMathField={problemList.theActiveMathField}
                deleteStepCallback={() => deleteStep(this, true)}
                editStepCallback={stepNumber => editStep(this, stepNumber)}
                activateMathField={field => this.activateMathField(field)}
                addStepCallback={img => addStep(this, true, img)}
                undoLastActionCallback={() => undoLastAction(this)}
                deleteStepsCallback={() => clearAll(this)}
                updateCallback={img => updateStep(this, img)}
                bindDisplayFunction={f => this.props.updateProblemStore({ displayScratchpad: f })}
                showDelete={problemStore.actionsStack.length > 0}
                newProblem={this.id === 'newEditor'}
            />
        );

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader
                        {...this}
                        {...this.props}
                        {...this.props.problemStore}
                        {...this.props.problemStore.solution.problem}
                        math={JSON.parse(
                            JSON.stringify(this.props.problemStore.solution.problem.text),
                        )}
                        example={this.props.example}
                    />
                    <MyStepsHeader readOnly={this.props.problemStore.readOnly} />
                    {myStepsList}
                    <div id="mainWorkAreaFooter" />
                </main>
            </div>
        );
    }
}


export default connect(
    state => ({
        problemStore: state.problem,
        problemList: state.problemList,
    }),
    problemActions,
)(Editor);
