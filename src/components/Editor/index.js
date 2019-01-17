import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import axios from 'axios';
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import ModalContainer, { CONFIRMATION_BACK, SHARE_SET } from '../ModalContainer';
import NotFound from '../NotFound';
import editor from './styles.css';
import { alertSuccess } from '../../scripts/alert';
import { undoLastAction, clearAll, stackEditAction } from './stack';
import {
    deleteStep, editStep, updateStep, addStep,
} from './stepsOperations';
import Locales from '../../strings';
import googleAnalytics from '../../scripts/googleAnalytics';
import { SERVER_URL, FRONTEND_URL } from '../../config';
import exampleProblem from './example.json';
import scrollTo from '../../scripts/scrollTo';

const mathLive = DEBUG_MODE ? require('../../../../mathlive/src/mathlive.js').default
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
                        stepValue: '',
                        explanation: Locales.strings.loading,
                    },
                ],
                editCode: null,
            },
            stepsFromLastSave: [
                {
                    stepValue: '',
                    explanation: Locales.strings.loading,
                },
            ],
            activeModals: [],
            editorPosition: 0,
            editedStep: null,
            allowedPalettes: [],
            theActiveMathField: null,
            textAreaValue: '',
            actionsStack: [],
            updateMathFieldMode: false,
            editing: false,
            shareLink: 'http:mathshare.com/exampleShareLink/1',
            editLink: Locales.strings.not_saved_yet,
            readOnly: false,
            displayScratchpad: null,
            notFound: false,
        };

        this.toggleModals = this.toggleModals.bind(this);
        this.restoreEditorPosition = this.restoreEditorPosition.bind(this);
        this.cancelEditCallback = this.cancelEditCallback.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
        this.getApplicationNode = this.getApplicationNode.bind(this);
        this.shareProblem = this.shareProblem.bind(this);
        this.saveProblem = this.saveProblem.bind(this);
        this.goBack = this.goBack.bind(this);
        this.redButtonCallback = this.redButtonCallback.bind(this);
        this.greenButtonCallback = this.greenButtonCallback.bind(this);
    }

    componentDidMount() {
        let path;
        if (this.props.example) {
            const solution = {
                problem: exampleProblem,
                steps: exampleProblem.steps,
            };

            this.setState({
                solution,
                editorPosition: this.countEditorPosition(exampleProblem.steps),
                readOnly: false,
                allowedPalettes: 'Edit;Operators;Notations;Geometry',
            });
        } else {
            if (this.props.match.params.action === 'view') {
                path = `${SERVER_URL}/solution/revision/${this.props.match.params.code}`;
            } else {
                path = `${SERVER_URL}/solution/${this.props.match.params.code}/`;
            }
            axios.get(path)
                .then((response) => {
                    if (response.status !== 200) {
                        this.setState({ notFound: true });
                    } else {
                        const solution = {
                            problem: response.data.problem,
                            steps: response.data.steps,
                            editCode: response.data.editCode,
                        };
                        this.setState((prevState) => {
                            const field = prevState.theActiveMathField;
                            field.latex(
                                response.data.steps[response.data.steps.length - 1].stepValue,
                            );
                            return {
                                solution,
                                editorPosition: this.countEditorPosition(response.data.steps),
                                theActiveMathField: field,
                                readOnly: this.props.match.params.action === 'view',
                                stepsFromLastSave: JSON.parse(JSON.stringify(response.data.steps)),
                                allowedPalettes: response.data.palettes,
                            };
                        });
                    }
                }).catch(() => {
                    this.setState({ notFound: true });
                });
        }
        this.scrollToBottom();
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
        if (!this.compareStepArrays(this.state.solution.steps, this.state.stepsFromLastSave)
            && !this.props.example) {
            this.toggleModals([CONFIRMATION_BACK]);
        } else {
            this.props.history.goBack();
        }
    }

    saveProblem() {
        if (this.props.example) {
            this.setState({ editLink: Locales.strings.example_edit_code });
        } else {
            googleAnalytics('Save');
            axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
                .then(() => {
                    this.setState((prevState) => {
                        const editCode = prevState.solution.editCode;
                        const steps = prevState.solution.steps;
                        return {
                            editLink: `${FRONTEND_URL}/problem/edit/${editCode}`,
                            stepsFromLastSave: JSON.parse(JSON.stringify(steps)),
                        };
                    });
                    alertSuccess(Locales.strings.problem_saved_success_message,
                        Locales.strings.success);
                });
        }
    }

    shareProblem() {
        if (this.props.example) {
            this.setState({
                shareLink: Locales.strings.example_share_code,
            }, this.toggleModals([SHARE_SET]));
        } else {
            axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
                .then((response) => {
                    this.setState({
                        shareLink: `${FRONTEND_URL}/problem/view/${response.data.shareCode}`,
                    }, this.toggleModals([SHARE_SET]));
                });
        }
    }

    textAreaChanged(text) {
        this.setState({ textAreaValue: text });
    }

    countEditorPosition(steps) {
        return steps.length + this.countCleanups(steps) - 1;
    }

    restoreEditorPosition() {
        this.setState((prevState) => {
            const updatedMathField = prevState.theActiveMathField;
            const lastStep = prevState.solution.steps[prevState.solution.steps.length - 1];
            updatedMathField.latex(lastStep.cleanup ? lastStep.cleanup : lastStep.stepValue);
            return {
                theActiveMathField: updatedMathField,
                editorPosition: this.countEditorPosition(prevState.solution.steps),
                editing: false,
            };
        });
        this.state.theActiveMathField.focus();
    }

    cancelEditCallback(oldEquation, oldExplanation, cleanup, index, img) {
        this.restoreEditorPosition();
        stackEditAction(this, index, oldEquation, cleanup, oldExplanation, img);
        this.state.displayScratchpad();
    }

    moveEditorBelowSpecificStep(stepNumber) {
        const steps = this.state.solution.steps.slice();
        const leftPartOfSteps = steps.splice(0, stepNumber);
        let editorPosition = this.countEditorPosition(leftPartOfSteps);
        if (leftPartOfSteps[leftPartOfSteps.length - 1].cleanup) {
            editorPosition -= 1;
        }
        this.setState({ editorPosition });
    }

    updateMathEditorRow(mathContent, mathAnnotation, mathStepNumber, cleanup, scratchpad) {
        this.setState((prevState) => {
            const updatedHistory = prevState.solution.steps;
            updatedHistory[mathStepNumber].stepValue = mathContent;
            updatedHistory[mathStepNumber].explanation = mathAnnotation;
            updatedHistory[mathStepNumber].cleanup = cleanup;
            updatedHistory[mathStepNumber].scratchpad = scratchpad;
            const oldSolution = prevState.solution;
            oldSolution.steps = updatedHistory;
            return {
                solution: oldSolution,
                textAreaValue: '',
                editorPosition: this.countEditorPosition(prevState.solution.steps),
            };
        });
        mathLive.renderMathInDocument();
    }

    toggleModals(modals) {
        this.setState((prevState) => {
            let oldModals = prevState.activeModals;
            // eslint-disable-next-line no-restricted-syntax
            for (const modal of modals) {
                if (prevState.activeModals.indexOf(modal) !== -1) {
                    oldModals = oldModals.filter(e => e !== modal);
                } else {
                    oldModals.push(modal);
                }
            }
            return { activeModals: oldModals };
        });
    }

    greenButtonCallback() {
        this.toggleModals([CONFIRMATION_BACK]);
        this.saveProblem();
    }

    redButtonCallback() {
        this.toggleModals([CONFIRMATION_BACK]);
        this.props.history.goBack();
    }

    activateMathField(theActiveMathField) {
        this.setState({ theActiveMathField },
            () => {
                if (this.props.example) {
                    const field = theActiveMathField;
                    field.latex(exampleProblem.steps[exampleProblem.steps.length - 1].stepValue);
                    this.setState({
                        theActiveMathField: field,
                    });
                }
            });
    }

    render() {
        if (this.state.notFound) {
            return <NotFound />;
        }

        const myStepsList = (
            <MyStepsList
                {...this}
                {...this.state}
                deleteStepCallback={() => deleteStep(this, true)}
                editStepCallback={stepNumber => editStep(this, stepNumber)}
                activateMathField={field => this.activateMathField(field)}
                addStepCallback={img => addStep(this, true, img)}
                undoLastActionCallback={() => undoLastAction(this)}
                deleteStepsCallback={() => clearAll(this)}
                updateCallback={img => updateStep(this, img)}
                bindDisplayFunction={f => this.setState({ displayScratchpad: f })}
                showUndo={this.state.actionsStack.length > 0}
                newProblem={this.id === 'newEditor'}
            />
        );

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <ModalContainer {...this} {...this.state} />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader
                        {...this}
                        {...this.state}
                        {...this.state.solution.problem}
                        math={JSON.parse(JSON.stringify(this.state.solution.problem.text))}
                        example={this.props.example}
                    />
                    <MyStepsHeader readOnly={this.state.readOnly} />
                    {myStepsList}
                    <div id="mainWorkAreaFooter" />
                </main>
            </div>
        );
    }
}
