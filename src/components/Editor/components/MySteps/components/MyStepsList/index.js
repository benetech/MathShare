import React, { Component } from 'react';
import classNames from 'classnames';
import { GlobalHotKeys } from 'react-hotkeys';
import Step from './components/Step';
import myStepsList from './styles.scss';
import mySteps from '../../../../styles.scss';
import MyWork from '../../../MyWork';
import {
    CONFIRMATION_BACK,
} from '../../../../../ModalContainer';
import Locales from '../../../../../../strings';
import Button from '../../../../../Button';
import { stopEvent } from '../../../../../../services/events';
import { getScreenReaderText } from '../../../../../../services/screenReader';
import completeKeyMap from '../../../../../../constants/hotkeyConfig.json';
import { getMathshareLink } from '../../../../../../services/mathshare';


export default class MyStepsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readStep: 0,
        };
        this.buildStep = this.buildStep.bind(this);
        this.handlers = {
            READ_NEXT_STEP: this.readNextStep,
            READ_PREVIOUS_STEP: this.readPreviousStep,
        };
        this.keyMap = {
            READ_NEXT_STEP: completeKeyMap.READ_NEXT_STEP,
            READ_PREVIOUS_STEP: completeKeyMap.READ_PREVIOUS_STEP,
        };
        for (let index = 1; index < 10; index += 1) {
            this.handlers[`READ_STEP_${index}`] = this.readStep(index);
            this.keyMap[`READ_STEP_${index}`] = {
                name: `Read step no ${index}`,
                sequences: [
                    {
                        sequence: `ctrl+alt+${index}`,
                    },
                ],
                action: 'keyup',
            };
        }
    }

    isReadonly = () => {
        const { match, readOnly } = this.props;
        const { params } = match;
        const { action } = params;
        if (readOnly || action === 'view') {
            return true;
        }
        return false;
    }

    readStep = index => (e) => {
        const step = document.getElementById(`mathStep-${index}`);
        if (step) {
            const text = getScreenReaderText(step);
            this.props.announceOnAriaLive(text);
            this.setState({
                readStep: index,
            });
        } else {
            this.props.announceOnAriaLive(`${Locales.strings.no_step_number} ${index}`);
        }
        setTimeout(() => {
            this.props.clearAriaLive();
        }, 1000);
        return stopEvent(e);
    }

    readNextStep = (e) => {
        this.readStep(this.state.readStep + 1)(e);
    }

    readPreviousStep = (e) => {
        this.readStep(this.state.readStep - 1)(e);
    }

    findProblem = stepCount => () => {
        const {
            problemList, problemStore, match,
        } = this.props;
        const { solutions, set } = problemList;
        const { problems } = set;
        const { solution } = problemStore;
        const { params } = match;
        const { action, position } = params;

        let currentIndex = -1;
        let link = null;
        if (action !== 'edit' || !position) {
            currentIndex = solutions && solutions.findIndex(
                currentSolution => currentSolution.problem.id === solution.problem.id,
            );
            if (currentIndex > -1) {
                const nextSolution = solutions[
                    (solutions.length + currentIndex + stepCount) % solutions.length
                ];
                link = getMathshareLink(params, nextSolution, nextSolution.problem);
            }
        }
        if (!link) {
            currentIndex = problems && problems.findIndex(
                currentProblem => currentProblem.position === Number(position),
            );
            if (currentIndex > -1) {
                link = getMathshareLink(params, null, problems[
                    (problems.length + currentIndex + stepCount) % problems.length
                ]);
            }
        }
        if (link) {
            if (this.props.isEdited()) {
                this.props.toggleModals([CONFIRMATION_BACK], null, link);
            } else {
                const { scratchPadPainterro } = this.props.problemStore.work;
                if (scratchPadPainterro) {
                    scratchPadPainterro.clear();
                }
                this.props.history.replace(link);
            }
        }
    }

    buildStep(i, value, explanation, isCleanup, isEdited, scratchpad, stepsSize) {
        let showTrash = false;
        let showEdit = false;
        if (i > 0 && !this.isReadonly() && !isEdited) {
            showEdit = true;
        }

        if (i === this.props.solution.steps.length - 1
            && this.props.solution.steps.length > 1 && !this.isReadonly()) {
            showTrash = true;
        }

        return (
            <div key={`${isCleanup}-${i}`} className={myStepsList.background}>
                <Step
                    stepNumber={i + 1}
                    showClearAll={stepsSize && stepsSize > 1}
                    math={value}
                    annotation={explanation}
                    cleanup={isCleanup}
                    showEdit={showEdit && !isCleanup}
                    showTrash={showTrash && !isCleanup}
                    deleteStepCallback={this.props.deleteStepCallback}
                    editStepCallback={this.props.editStepCallback}
                    deleteStepsCallback={this.props.deleteStepsCallback}
                    readOnly={this.isReadonly()}
                    scratchpad={scratchpad}
                />
            </div>
        );
    }

    render() {
        const steps = [];
        let i = 0;
        let cleanups = 0;
        this.props.solution.steps.forEach((step) => {
            const isEdited = this.props.editing && (i + cleanups === this.props.editorPosition);
            steps.push(this.buildStep(i, step.stepValue, step.explanation, false, isEdited,
                step.scratchpad, this.props.solution.steps.length));
            i += 1;
            if (step.cleanup) {
                cleanups += 1;
                steps.push(this.buildStep(i, step.cleanup, Locales.strings.cleanup, true));
            }
        });

        const myWork = this.isReadonly() ? null
            : (
                <MyWork
                    allowedPalettes={this.props.allowedPalettes}
                    activateMathField={this.props.activateMathField}
                    theActiveMathField={this.props.theActiveMathField}
                    textAreaChanged={this.props.textAreaChanged}
                    textAreaValue={this.props.textAreaValue}
                    addStepCallback={this.props.addStepCallback}
                    undoLastActionCallback={this.props.undoLastActionCallback}
                    lastMathEquation={
                        this.props.solution.steps[this.props.solution.steps.length - 1].stepValue}
                    deleteStepsCallback={this.props.deleteStepsCallback}
                    cancelEditCallback={this.props.cancelEditCallback}
                    updateCallback={this.props.updateCallback}
                    editing={this.props.editing}
                    history={this.props.history}
                    solution={this.props.solution}
                    showDelete={this.props.showDelete}
                    title={Locales.strings.my_work}
                    bindDisplayFunction={this.props.bindDisplayFunction}
                    isStepView
                />
            );

        steps.splice(this.props.editorPosition + 1, 0,
            <div key="editor">
                <div className={classNames(myStepsList.background, myStepsList.padding)} />
                {myWork}
            </div>);

        return (
            <div id="HistoryWrapper" className={mySteps.historyWrapper}>
                <GlobalHotKeys
                    keyMap={this.keyMap}
                    handlers={this.handlers}
                    allowChanges
                />
                <div
                    className="row"
                    data-step="4"
                    data-intro={Locales.strings.history_data_intro}
                >
                    <div className="col-lg-12">
                        <div
                            id="MathHistory"
                            className={
                                classNames(
                                    'container-fluid',
                                    myStepsList.list,
                                )
                            }
                        >
                            {steps}
                        </div>
                        {!this.isReadonly() && (
                            <div className={myStepsList.btnRow}>
                                <Button
                                    id="prevProblem"
                                    className={classNames('btn', 'default', 'pointer', myStepsList.carouselBtn)}
                                    type="button"
                                    icon="arrow-left"
                                    content={Locales.strings.previous_problem}
                                    onClick={this.findProblem(-1)}
                                    spanStyle={myStepsList.btnContainer}
                                />
                                <Button
                                    id="finishBtn"
                                    className={classNames('btn', 'pointer')}
                                    additionalStyles={['finish']}
                                    type="button"
                                    icon="check"
                                    content={Locales.strings.finish}
                                    onClick={this.props.finishProblem}
                                    spanStyle={myStepsList.finishContainer}
                                />
                                <Button
                                    id="nextProblem"
                                    className={classNames('btn', 'default', 'pointer', myStepsList.carouselBtn)}
                                    type="button"
                                    icon="arrow-right"
                                    content={Locales.strings.next_problem}
                                    onClick={this.findProblem(1)}
                                    spanStyle={myStepsList.btnContainer}
                                    iconAfterContent
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
