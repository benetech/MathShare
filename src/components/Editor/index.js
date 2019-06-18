import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import {
    CONFIRMATION_BACK, SHARE_SET, VIEW_SET,
} from '../ModalContainer';
import NotFound from '../NotFound';
import editor from './styles.scss';
import { alertSuccess } from '../../scripts/alert';
import { stackEditAction } from './stackOperations';
import { clearAll, undoLastAction } from './stack';
import {
    deleteStep, editStep, updateStep, addStep,
} from './stepsOperations';
import problemActions from '../../redux/problem/actions';
import { countEditorPosition } from '../../redux/problem/helpers';
import Locales from '../../strings';
import googleAnalytics from '../../scripts/googleAnalytics';
import { SERVER_URL, FRONTEND_URL } from '../../config';
import { updateSolution } from '../../services/review';
import exampleProblem from './example.json';
import scrollTo from '../../scripts/scrollTo';

const mathLive = DEBUG_MODE ? require('../../../../mathlive/src/mathlive.js').default
    : require('../../lib/mathlivedist/mathlive.js');

class Editor extends Component {
    constructor(props) {
        super(props);
        this.restoreEditorPosition = this.restoreEditorPosition.bind(this);
        this.cancelEditCallback = this.cancelEditCallback.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.getApplicationNode = this.getApplicationNode.bind(this);
        this.shareProblem = this.shareProblem.bind(this);
        this.saveProblem = this.saveProblem.bind(this);
        this.finishProblem = this.finishProblem.bind(this);
        this.viewProblem = this.viewProblem.bind(this);
        this.goBack = this.goBack.bind(this);
        this.greenButtonCallback = this.greenButtonCallback.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    componentWillMount() {
        const { match } = this.props;
        if (match.params.action === 'view') {
            googleAnalytics('View a Problem: Teacher');
        } else if (match.params.action === 'edit') {
            googleAnalytics('View a Problem: Student');
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
                && this.compareStepArrays(solution.steps, stepsFromLastSave))) {
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

    compareStepArrays = (first, second) => {
        if (first.length !== second.length) {
            return false;
        }
        for (let i = 0; i < first.length; i += 1) {
            if (first[i].stepValue !== second[i].stepValue
                || first[i].explanation !== second[i].explanation
                || first[i].scratchpad !== second[i].scratchpad) {
                return false;
            }
        }
        return true;
    }

    goBack() {
        const { problemStore } = this.props;
        if (!this.compareStepArrays(problemStore.solution.steps, problemStore.stepsFromLastSave)
            && !this.props.example) {
            this.props.toggleModals([CONFIRMATION_BACK]);
        } else {
            this.props.history.goBack();
        }
    }

    saveProblem() {
        return new Promise((resolve, reject) => {
            if (this.props.example) {
                this.props.updateProblemStore({ editLink: Locales.strings.example_edit_code });
                resolve(true);
            } else {
                googleAnalytics('Save Problem');
                axios.put(`${SERVER_URL}/solution/${this.props.problemStore.solution.editCode}`, this.props.problemStore.solution)
                    .then((response) => {
                        const { problemStore } = this.props;
                        const solution = response.data;
                        updateSolution(solution);
                        const editCode = problemStore.solution.editCode;
                        const steps = problemStore.solution.steps;
                        this.props.updateProblemStore({
                            editLink: `${FRONTEND_URL}/app/problem/edit/${editCode}`,
                            stepsFromLastSave: JSON.parse(JSON.stringify(steps)),
                            lastSaved: (new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })),
                            isUpdated: false,
                        });
                        alertSuccess(Locales.strings.problem_saved_success_message,
                            Locales.strings.success);
                        resolve(true);
                    }).catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    finishProblem() {
        this.saveProblem().then(() => {
            this.goBack();
        });
    }

    shareProblem() {
        if (this.props.example) {
            this.props.updateProblemStore({
                shareLink: Locales.strings.example_share_code,
            });
            this.props.toggleModals([SHARE_SET]);
        } else {
            googleAnalytics('Share Problem');
            updateSolution(this.props.problemStore.solution);
            axios.put(`${SERVER_URL}/solution/${this.props.problemStore.solution.editCode}`, this.props.problemStore.solution)
                .then((response) => {
                    this.props.updateProblemStore({
                        shareLink: `${FRONTEND_URL}/app/problem/view/${response.data.shareCode}`,
                    });
                    this.props.toggleModals([SHARE_SET]);
                });
        }
    }

    viewProblem() {
        this.props.toggleModals([VIEW_SET]);
    }

    textAreaChanged(text) {
        this.props.updateProblemStore({ textAreaValue: text });
    }

    countEditorPosition(steps) {
        return steps.length + this.countCleanups(steps) - 1;
    }

    restoreEditorPosition() {
        const { problemStore } = this.props;
        const updatedMathField = problemStore.theActiveMathField;
        const lastStep = problemStore.solution.steps[problemStore.solution.steps.length - 1];
        updatedMathField.latex(lastStep.cleanup ? lastStep.cleanup : lastStep.stepValue);
        this.props.updateProblemStore({
            theActiveMathField: updatedMathField,
            editorPosition: countEditorPosition(problemStore.solution.steps),
            editing: false,
        });
        this.props.problemStore.theActiveMathField.focus();
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

    greenButtonCallback() {
        this.props.toggleModals([CONFIRMATION_BACK]);
        this.saveProblem();
    }

    activateMathField(theActiveMathField) {
        const field = theActiveMathField;
        this.props.setActiveMathFieldInProblem(field);
        if (this.props.example) {
            field.latex(exampleProblem.steps[exampleProblem.steps.length - 1].stepValue);
        }
    }

    render() {
        const { problemStore } = this.props;
        if (problemStore.notFound) {
            return <NotFound />;
        }

        const myStepsList = (
            <MyStepsList
                {...this}
                {...problemStore}
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
                {/* <ModalContainer
                    getApplicationNode={this.getApplicationNode}
                    finishProblem={this.finishProblem}
                    greenButtonCallback={this.greenButtonCallback}
                    shareProblem={this.shareProblem}
                    viewProblem={this.viewProblem}
                    textAreaChanged={this.textAreaChanged}
                    cancelEditCallback={this.cancelEditCallback}
                    moveEditorBelowSpecificStep={this.moveEditorBelowSpecificStep}
                    updateMathEditorRow={this.updateMathEditorRow}
                /> */}
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader
                        {...this}
                        {...this.props.problemStore}
                        {...this.props.problemStore.solution.problem}
                        math={JSON.parse(
                            JSON.stringify(this.props.problemStore.solution.problem.text),
                        )}
                        example={this.props.example}
                        shareProblem={this.shareProblem}
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
    }),
    problemActions,
)(Editor);
