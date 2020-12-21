import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faCheckCircle, faFlagCheckered, faLongArrowAltRight, faRedo, faUndo,
} from '@fortawesome/free-solid-svg-icons';
import {
    Affix, Row, Button, // Dropdown, Menu, Popconfirm,
} from 'antd';
import { connect } from 'react-redux';
import { MathfieldComponent } from 'react-mathlive';
import * as DeviceDetect from 'react-device-detect';
import problemActions from '../../redux/problem/actions';
import styles from './styles.scss';
// import { stopEvent } from '../../services/events';
import Locales from '../../strings';
import mathlive from '../../../../src/lib/mathlivedist/mathlive';
import { compareStepArrays, countEditorPosition } from '../../redux/problem/helpers';
import scrollTo from '../../services/scrollTo';
import Step from '../../components/Step';
// import CopyLink from '../../components/CopyLink';
// import Select from '../../components/Select';

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class Problem extends Component {
    state = {
        affixed: false,
    };

    placeholderAffix = null;

    actualAffixed = null;

    stepRefs = [];

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        window.addEventListener('beforeunload', this.onUnload);
        const { action, code, position } = this.props.match.params;
        this.initialize(action, code, position);
    }

    componentWillReceiveProps(newProps) {
        const oldParams = this.props.match.params;
        const newParams = newProps.match.params;
        if (oldParams.action !== newParams.action || oldParams.code !== newParams.code
            || oldParams.position !== newParams.position) {
            this.initialize(newParams.action, newParams.code, newParams.position);
        }
        this.scrollToBottom();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        window.removeEventListener('beforeunload', this.onUnload);
    }

    onUnload(event) {
        if (this.saveNotNeeded()) {
            return null;
        }
        const e = event || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
            e.preventDefault();
            e.returnValue = Locales.strings.sure;
        }
        this.props.commitProblemSolution();

        // For Safari
        return Locales.strings.sure;
    }

    initialize = (action, code) => {
        this.props.resetProblem();
        this.props.updateProblemStore({ textAreaValue: '' });
        this.setState({
            actionsStack: [],
        });
        const mathEditor = document.getElementById('mathEditorActive');
        if (mathEditor) {
            const { mathfield } = mathEditor;
            if (mathfield) {
                const { undoManager } = mathfield;
                if (undoManager) {
                    undoManager.reset();
                }
            }
        }
        this.props.loadProblem(action, code);
        // if (position) {
        //     this.props.requestProblemSet(action, code, position);
        // } else {
        //     this.props.loadProblem(action, code);
        // }
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

    getApplicationNode = () => document.getElementById('contentContainer')

    textAreaChanged = text => this.props.updateProblemStore({ textAreaValue: text });

    countEditorPosition = steps => steps.length + this.countCleanups(steps) - 1

    restoreEditorPosition = () => {
        const { problemState, problemList } = this.props;
        const updatedMathField = problemList.theActiveMathField;
        const commitedSteps = problemState.solution.steps.filter(step => !step.inProgress);
        const lastStep = commitedSteps[commitedSteps.length - 1];
        updatedMathField.$latex(lastStep.cleanup ? lastStep.cleanup : lastStep.stepValue);
        this.props.updateProblemStore({
            theActiveMathField: updatedMathField,
            editorPosition: countEditorPosition(problemState.solution.steps),
            editing: false,
        });
        problemList.theActiveMathField.$focus();
    }

    moveEditorBelowSpecificStep = (stepNumber) => {
        const steps = this.props.problemState.solution.steps.slice();
        const leftPartOfSteps = steps.splice(0, stepNumber);
        let editorPosition = this.countEditorPosition(leftPartOfSteps);
        if (leftPartOfSteps[leftPartOfSteps.length - 1].cleanup) {
            editorPosition -= 1;
        }
        this.props.updateProblemStore({ editorPosition });
    }

    updateMathEditorRow = (mathContent, mathAnnotation, mathStepNumber, cleanup, scratchpad) => {
        const { problemState } = this.props;
        const updatedHistory = problemState.solution.steps;
        updatedHistory[mathStepNumber].stepValue = mathContent;
        updatedHistory[mathStepNumber].explanation = mathAnnotation;
        updatedHistory[mathStepNumber].cleanup = cleanup;
        updatedHistory[mathStepNumber].scratchpad = scratchpad;
        const oldSolution = problemState.solution;
        oldSolution.steps = updatedHistory;
        this.props.updateProblemStore({
            solution: oldSolution,
            textAreaValue: '',
            editorPosition: countEditorPosition(problemState.solution.steps),
        });
        mathlive.renderMathInDocument();
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    handleDropdownSelect = (e) => {
        console.log('e', e);
    }

    saveNotNeeded = () => {
        const { solution, stepsFromLastSave } = this.props.problemState;
        console.log('saveNotNeeded filtered steps', solution.steps.filter(step => step.stepValue || step.explanation));
        console.log('saveNotNeeded stepsFromLastSave', stepsFromLastSave);
        const { location } = this.props;
        if (location.pathname.indexOf('/app/problem/view') === '0' // check if the open view is readonly
            || (compareStepArrays(
                solution.steps.filter(step => step.stepValue || step.explanation),
                stepsFromLastSave,
            ))) {
            return true;
        }
        return false;
    }

    loadData = (action, code) => {
        const {
            problemSet,
        } = this.props;
        const {
            set, solutions, title, archiveMode, source, reviewCode,
        } = problemSet;
        const { editCode } = set;
        if (action === 'edit' || action === 'solve') {
            if (editCode === code) {
                if (action === 'edit') {
                    this.props.requestProblemSetSuccess(set);
                }
                if (action === 'solve') {
                    this.props.setReviewSolutions(
                        set.id, solutions, reviewCode, editCode, title, archiveMode, source,
                    );
                }
                return;
            }
        }

        if (action === 'review' && reviewCode === code) {
            this.props.setReviewSolutions(
                set.id, solutions, reviewCode, editCode, title, archiveMode, source,
            );
            return;
        }

        if (action === 'solve') {
            this.props.loadProblemSetSolutionByEditCode(code);
        } else {
            this.props.requestProblemSet(action, code);
        }
    }

    getData = () => {
        const { problemSet } = this.props;
        const { set, solutions } = problemSet;
        if (solutions && solutions.length > 0) {
            return solutions;
        }
        return set.problems;
    }

    showMathEllipsis = () => {
        const affixMathContainer = document.getElementById('affixMathContainer');
        if (!affixMathContainer) {
            return false;
        }
        const mathFields = affixMathContainer.querySelectorAll('.ML__mathlive');
        if (!mathFields || mathFields.length === 0) {
            return false;
        }
        if (affixMathContainer.offsetWidth < mathFields[0].offsetWidth) {
            return true;
        }
        return false;
    }

    getPlaceholderAffixStyle = () => {
        if (!this.placeholderAffix) {
            return {};
        }

        this.placeholderAffix.measure();

        return {
            ...this.placeholderAffix.state.affixStyle,
            ...this.placeholderAffix.state.placeholderStyle,
            height: 'auto',
        };
    }

    getStepPaddingTop = () => {
        if (!this.actualAffixed || !this.state.affixed || !this.state.time) {
            return {};
        }
        this.placeholderAffix.measure();
        return {
            paddingTop: `${this.actualAffixed.offsetHeight - 90}px`,
            display: 'block',
        };
    }

    goBack = () => {
        const { problemSet } = this.props;
        const url = `/app/problemSet/solve/${problemSet.editCode}`;
        if (this.saveNotNeeded()) {
            this.props.history.replace(url);
        } else {
            this.props.commitProblemSolution(url);
        }
    }

    shouldMoveAddStep = () => {
        const {
            problemState,
            ui,
        } = this.props;
        const { keyboardVisible } = problemState;
        const { focused } = ui;
        const { className, tag } = focused;
        const {
            isAndroid,
            isMobile,
        } = DeviceDetect;

        console.log('DeviceDetect', DeviceDetect);

        const focusedMathlive = (className || '').includes('ML__textarea__textarea');
        if (keyboardVisible
            || (isMobile && !isAndroid && tag === 'TEXTAREA' && !focusedMathlive)
        ) {
            return true;
        }

        return false;
    }

    goBackText = () => {
        const {
            problemSet,
        } = this.props;
        const { title } = problemSet;
        return Locales.strings.back_to_problem_set.replace('{title}', title);
    }

    renderStep = (step, index) => {
        const { explanation, stepValue } = step;
        return <Step key={`${index}-step`} index={index} stepValue={stepValue} explanation={explanation} />;
    }

    renderStepSection = () => {
        const { problemState, problemSet } = this.props;
        const { solution } = problemState;
        const { solutions } = problemSet;
        const editCodes = solutions && solutions.map(s => s.editCode);
        if (!solution.editCode) {
            return null;
        }
        const currentIndex = editCodes && editCodes.indexOf(solution.editCode);

        return (
            <div className={styles.steps} style={this.getStepPaddingTop()}>
                <div className={styles.stepSectionHeader}>
                    <div className={styles.mySteps}>My Steps</div>
                    <div className={styles.right}>
                        <Button
                            aria-label={Locales.strings.back_to_all_sets}
                            onClick={() => {
                                const url = `/app/problem/edit/${editCodes[currentIndex - 1]}`;
                                if (this.saveNotNeeded()) {
                                    this.props.history.replace(url);
                                } else {
                                    this.props.commitProblemSolution(url);
                                }
                            }}
                            type="text"
                            disabled={currentIndex === 0}
                            icon={<FontAwesomeIcon icon={faUndo} size="2x" />}
                        />
                        <Button
                            aria-label={Locales.strings.back_to_all_sets}
                            onClick={() => {
                                const url = `/app/problem/edit/${editCodes[currentIndex + 1]}`;
                                if (this.saveNotNeeded()) {
                                    this.props.history.replace(url);
                                } else {
                                    this.props.commitProblemSolution(url);
                                }
                            }}
                            type="text"
                            disabled={currentIndex === (editCodes.length - 1)}
                            icon={<FontAwesomeIcon icon={faRedo} size="2x" />}
                        />
                    </div>
                </div>
                {solution.steps.map(this.renderStep)}
            </div>
        );
    }

    render() {
        const {
            problemState,
            problemSet,
            ui,
            // match,
            // userProfile,
            // routerHooks,
        } = this.props;
        const { solution } = problemState;
        const { title } = problemSet;
        const { problem, finished } = solution;
        const { sideBarCollapsed } = ui;

        const showMathEllipsis = this.showMathEllipsis();
        // const {
        //     action,
        // } = match.params;
        // const { set } = problemSet;

        return (
            <div className={styles.container}>
                <Row
                    gutter={gutter}
                    className={styles.heading}
                >
                    <div className={styles.topBar}>
                        <span className={styles.back}>
                            <Button
                                aria-label={this.goBackText()}
                                onClick={this.goBack}
                                type="text"
                                icon={(
                                    <>
                                        <span />
                                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                                    </>
                                )}
                            />
                        </span>
                        <span className={styles.title}>{title}</span>
                    </div>
                </Row>
                <Row
                    gutter={gutter}
                    className={styles.staticProblem}
                >
                    <FontAwesomeIcon
                        icon={faFlagCheckered}
                        title="checkered flag"
                        role="img"
                    />
                    <span className={styles.problem}>
                        Problem
                        {finished && (
                            <div className={styles.check}>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    title="Finished Checkmark"
                                    role="img"
                                />
                            </div>
                        )}
                    </span>
                </Row>
                <Affix
                    onChange={affixed => this.setState({ affixed })}
                    ref={(ref) => { this.placeholderAffix = ref; }}
                >
                    <div className={styles.affixPlaceholder} />
                </Affix>
                <Row
                    gutter={gutter}
                    className={styles.mathText}
                >
                    <MathfieldComponent
                        tabIndex={0}
                        latex={problem.text || ''}
                        mathfieldConfig={{
                            readOnly: true,
                        }}
                    />
                </Row>
                <Row
                    gutter={gutter}
                    className={styles.title}
                >
                    {problem.title}
                </Row>
                <hr />
                <div className={`${this.state.affixed ? styles.affixedTopbar : styles.hiddenTopbar}`} style={this.getPlaceholderAffixStyle()} ref={(ref) => { this.actualAffixed = ref; }}>
                    <div
                        className={`ant-row ${styles.heading}`}
                    >
                        <div className={styles.topBar}>
                            <span className={styles.back}>
                                <Button
                                    aria-label={this.goBackText()}
                                    onClick={this.goBack}
                                    type="text"
                                    icon={(
                                        <>
                                            <span />
                                            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                                        </>
                                    )}
                                />
                            </span>
                            <span className={styles.title}>{title}</span>
                        </div>
                    </div>
                    <div
                        className="ant-row"
                    >
                        <div className={styles.staticProblem}>
                            <span className={styles.left}>
                                <span><FontAwesomeIcon icon={faFlagCheckered} /></span>
                                <span className={styles.problem}>
                                    Problem
                                    {finished && (
                                        <div className={styles.check}>
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                title="Finished Checkmark"
                                                role="img"
                                            />
                                        </div>
                                    )}
                                </span>
                            </span>
                            <span id="affixMathContainer" className={`${styles.right} ${showMathEllipsis ? styles.hasEllipsis : ''}`}>
                                <MathfieldComponent
                                    tabIndex={0}
                                    latex={problem.text || ''}
                                    mathfieldConfig={{
                                        readOnly: true,
                                    }}
                                />
                                {showMathEllipsis && <span className={styles.ellipsis}>...</span>}
                            </span>
                        </div>
                    </div>
                    <hr />
                </div>
                {this.renderStepSection()}
                <div className={`${styles.footerBtn} ${sideBarCollapsed ? styles.sideBarCollapsed : styles.sideBarOpened}`}>
                    {!finished && (
                        <Button
                            className={this.shouldMoveAddStep() ? styles.moveAddStep : ''}
                            aria-label="Finish?"
                            type="primary"
                            size="large"
                            onClick={() => {
                                this.props.commitProblemSolution('back', false, true);
                            }}
                        >
                            <span>Finish?</span>
                            <FontAwesomeIcon
                                className={styles.finishBtn}
                                icon={faCheckCircle}
                                title="Finished Checkmark"
                                role="img"
                            />
                        </Button>
                    )}
                    <Button
                        className={`${this.shouldMoveAddStep() ? styles.moveAddStep : ''} ${finished ? styles.moveBtnRight : ''}`}
                        aria-label={Locales.strings.back_to_all_sets}
                        type="primary"
                        size="large"
                        onClick={() => {
                            this.props.addStep(null);
                            this.props.commitProblemSolution();
                        }}
                    >
                        <span>Add Step</span>
                        <FontAwesomeIcon icon={faLongArrowAltRight} size="2x" />
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        problemState: state.problem,
        problemSet: state.problemSet,
        userProfile: state.userProfile,
        ui: state.ui,
        routerHooks: state.routerHooks,
        router: state.router,
    }),
    {
        ...problemActions,
    },
)(Problem);
