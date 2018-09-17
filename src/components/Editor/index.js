import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import ModalContainer, { CONFIRMATION_BACK, SHARE_SET } from '../ModalContainer';
import NotFound from '../NotFound';
import editor from './styles.css';
import { NotificationContainer } from 'react-notifications';
import { alertSuccess } from '../../scripts/alert';
import { undoLastAction, clearAll, stackEditAction } from './stack';
import { deleteStep, editStep, updateStep, addStep } from './stepsOperations';
import Locales from '../../strings';
import axios from 'axios';
import googleAnalytics from '../../scripts/googleAnalytics';
import { SERVER_URL } from '../../config';
import exampleProblem from './example.json';

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
            activeModals: [],
            editorPosition: 0,
            editedStep: null,
            allowedPalettes: [],
            theActiveMathField: null,
            textAreaValue: "",
            actionsStack: [],
            updateMathFieldMode: false,
            editing: false,
            shareLink: "http:mathshare.com/exampleShareLink/1",
            editLink: "Not saved yet.",
            readOnly: false,
            displayScratchpad: null,
            notFound: false
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
        var path;
        if (this.props.example) {
            var solution = {
                problem: exampleProblem,
                steps: exampleProblem.steps,
            }

            this.setState({
                solution,
                editorPosition: this.countEditorPosition(exampleProblem.steps),
                readOnly: false,
                allowedPalettes: "Edit;Operators;Notations;Geometry"
            });
        } else {
            if (this.props.match.params.action == "view") {
                path = `${SERVER_URL}/solution/revision/${this.props.match.params.code}`
            } else {
                path = `${SERVER_URL}/solution/${this.props.match.params.code}/`
            }
            axios.get(path)
                .then(response => {
                    if (response.status != 200) {
                        this.setState({ notFound: true });
                    } else {
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
                    }
                }).catch((error) => {
                    this.setState({ notFound: true });
                });
        }
        this.scrollToBottom();
    }

    textAreaChanged(text) {
        this.setState({ textAreaValue: text });
    }

    updateMathEditorRow(mathContent, mathAnnotation, mathStepNumber, cleanup, scratchpad) {
        let updatedHistory = this.state.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = mathAnnotation;
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

    cancelEditCallback(oldEquation, oldExplanation, cleanup, index, img) {
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
        try {
            document.querySelector("#MainWorkWrapper").scrollTo(0, document.querySelector("#MainWorkWrapper").scrollHeight);
        } catch (e) {
            console.log("scrollTo method not supported");
        }
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
        if (this.props.example) {
            this.setState({
                shareLink: Locales.strings.example_share_code
            }, this.toggleModals([SHARE_SET]));
        } else {
            axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
                .then(response => {
                    this.setState({
                        shareLink: SERVER_URL + '/problem/view/' + response.data.shareCode
                    }, this.toggleModals([SHARE_SET]));
                })
        }
    };

    saveProblem() {
        if (this.props.example) {
            this.setState({editLink: Locales.strings.example_edit_code });
        } else {
            googleAnalytics('Save');
            axios.put(`${SERVER_URL}/solution/${this.state.solution.editCode}`, this.state.solution)
                .then(response => {
                    this.setState({
                        editLink: SERVER_URL + '/problem/edit/' + this.state.solution.editCode,
                        stepsFromLastSave: JSON.parse(JSON.stringify(this.state.solution.steps))
                    })
                    alertSuccess(Locales.strings.problem_saved_success_message, Locales.strings.success);
                }
                )
        }
    };

    goBack() {
        if (!this.compareStepArrays(this.state.solution.steps, this.state.stepsFromLastSave) && !this.props.example) {
            this.toggleModals([CONFIRMATION_BACK]);
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

    toggleModals(modals) {
        var oldModals = this.state.activeModals;
        for (var modal of modals) {
            if (this.state.activeModals.indexOf(modal) != -1) {
                oldModals = oldModals.filter(e => e !== modal);
            } else {
                oldModals.push(modal);
            }
        }
        this.setState({ activeModals: oldModals });
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
        this.setState({ theActiveMathField: theActiveMathField },
            () => {
                if (this.props.example) {
                    let field = theActiveMathField;
                    field.latex(exampleProblem.steps[exampleProblem.steps.length - 1].stepValue);
                    this.setState({
                        theActiveMathField: field
                    });
                }
            });
    }

    render() {
        if (this.state.notFound) {
            return <NotFound />
        }

        const myStepsList = <MyStepsList {...this} {...this.state}
            deleteStepCallback={() => deleteStep(this, true)}
            editStepCallback={(stepNumber) => editStep(this, stepNumber)}
            activateMathField={(field) => this.activateMathField(field)}
            addStepCallback={(img) => addStep(this, true, img)}
            undoLastActionCallback={() => undoLastAction(this)}
            deleteStepsCallback={() => clearAll(this)}
            updateCallback={(img) => updateStep(this, img)}
            bindDisplayFunction={(f) => this.setState({ displayScratchpad: f })}
            showUndo={this.state.actionsStack.length > 0}
            newProblem={this.id === "newEditor"} />

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <NotificationContainer />
                <ModalContainer {...this} {...this.state} />
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader {...this} {...this.state} {...this.state.solution.problem}
                        math={JSON.parse(JSON.stringify(this.state.solution.problem.text))} example={this.props.example}
                    />
                    <MyStepsHeader readOnly={this.state.readOnly} />
                    {myStepsList}
                    <div ref={el => { this.el = el; }} style={{ height: 50 }}></div>
                </main>
            </div>
        );
    }
}
