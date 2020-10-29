import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFlagCheckered, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import {
    Affix, Row, Button, // Dropdown, Menu, Popconfirm,
} from 'antd';
import { connect } from 'react-redux';
import { MathfieldComponent } from 'react-mathlive';
import problemActions from '../../redux/problem/actions';
import styles from './styles.scss';
// import { stopEvent } from '../../services/events';
import Locales from '../../strings';
import mathlive from '../../../../src/lib/mathlivedist/mathlive';
import { compareStepArrays, countEditorPosition } from '../../redux/problem/helpers';
import scrollTo from '../../services/scrollTo';
import { stackEditAction } from '../../components/Editor/stackOperations';
import exampleProblem from '../../components/Editor/example.json';
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

    // componentWillMount() {
    //     const { match } = this.props;
    //     if (match.params.action === 'view') {
    //         googleAnalytics('View a Problem: Teacher');
    //     } else if (match.params.action === 'edit') {
    //         googleAnalytics('View a Problem: Student');
    //         IntercomAPI('trackEvent', 'work-a-problem');
    //     }
    // }

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
        const { editLink, solution, stepsFromLastSave } = this.props.problemState;
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
            e.returnValue = Locales.strings.sure;
        }

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

    cancelEditCallback = (oldEquation, oldExplanation, cleanup, index, img) => {
        this.restoreEditorPosition();
        stackEditAction(this, index, oldEquation, cleanup, oldExplanation, img);
        this.props.problemState.displayScratchpad();
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

    activateMathField = (theActiveMathField) => {
        const field = theActiveMathField;
        this.props.setActiveMathFieldInProblem(field);
        if (this.props.example) {
            field.$latex(exampleProblem.steps[exampleProblem.steps.length - 1].stepValue);
        }
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    handleDropdownSelect = (e) => {
        console.log('e', e);
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
            paddingTop: `${this.actualAffixed.offsetHeight + 20}px`,
            display: 'block',
        };
    }

    renderStep = (step, index) => {
        const { exaplanation, stepValue } = step;
        return (
            <div className={styles.step}>
                <div className={styles.stepHeading}>
                    Step
                    {' '}
                    {index + 1}
                </div>
                <div className={styles.stepBody}>
                    <div className={styles.mathContainer}>
                        <span role="img" aria-label="pencil emoji">✏️</span>
                        <MathfieldComponent
                            initialLatex={stepValue}
                            mathfieldConfig={{
                                virtualKeyboardMode: 'onfocus',
                                smartMode: true,
                                // onContentDidChange: (mf) => {
                                //     const latex = mf.getValue();
                                //     console.log('latex', latex);
                                // },
                            }}
                        />
                    </div>
                    <div className={styles.explanationContainer}>
                        <span className={styles.icon} role="img" aria-label="speech bubble emoji">💬</span>
                        <textarea
                            className={styles.exaplanation}
                            placeholder="Add your explanation here"
                            value={exaplanation}
                            rows="1"
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderStepSection = () => {
        const { problemState } = this.props;
        const { solution } = problemState;
        if (!solution.editCode) {
            return null;
        }
        return (
            <div className={styles.steps} style={this.getStepPaddingTop()}>
                <div className={styles.stepSectionHeader}>
                    <div>My Steps</div>
                </div>
                {solution.steps.map(this.renderStep)}
            </div>
        );
    }

    render() {
        const {
            problemState,
            problemSet,
            // match,
            // userProfile,
            // routerHooks,
        } = this.props;
        const { solution } = problemState;
        const { title } = problemSet;
        const { problem } = solution;

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
                                aria-label={Locales.strings.back_to_all_sets}
                                onClick={() => {
                                    this.props.history.goBack();
                                }}
                                type="text"
                                icon={<FontAwesomeIcon icon={faArrowLeft} size="2x" />}
                            />
                        </span>
                        <span className={styles.title}>{title}</span>
                    </div>
                </Row>
                <Row
                    gutter={gutter}
                    className={styles.staticProblem}
                >
                    <span aria-label="checkered flag"><FontAwesomeIcon icon={faFlagCheckered} /></span>
                    <span className={styles.problem}>Problem</span>
                </Row>
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
                <Affix
                    onChange={affixed => this.setState({ affixed })}
                    ref={(ref) => { this.placeholderAffix = ref; }}
                >
                    <div className={styles.affixPlaceholder} />
                </Affix>
                <div className={`${this.state.affixed ? styles.affixedTopbar : styles.hiddenTopbar}`} style={this.getPlaceholderAffixStyle()} ref={(ref) => { this.actualAffixed = ref; }}>
                    <Row
                        gutter={gutter}
                        className={styles.heading}
                    >
                        <div className={styles.topBar}>
                            <span className={styles.back}>
                                <Button
                                    aria-label={Locales.strings.back_to_all_sets}
                                    onClick={() => {
                                        this.props.history.goBack();
                                    }}
                                    type="text"
                                    icon={<FontAwesomeIcon icon={faArrowLeft} size="2x" />}
                                />
                            </span>
                            <span className={styles.title}>{title}</span>
                        </div>
                    </Row>
                    <div className={styles.staticProblem}>
                        <span className={styles.left}>
                            <span><FontAwesomeIcon icon={faFlagCheckered} /></span>
                            <span className={styles.problem}>Problem</span>
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
                    <hr />
                </div>
                {this.renderStepSection()}
                <div className={styles.footerBtn}>
                    <Button
                        aria-label={Locales.strings.back_to_all_sets}
                        type="primary"
                        size="large"
                        onClick={() => {
                            console.log('click');
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
