import {
    faArrowLeft, faCopy, faEllipsisH, faMinusCircle, faShare, faPen, faPlusCircle, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import Textarea from 'react-expanding-textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Row, Col, Button, Dropdown, Menu, Modal,
} from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Card from '../../components/ProblemCard';
import problemSetListActions from '../../redux/problemSetList/actions';
import problemSetActions from '../../redux/problemSet/actions';
import styles from './styles.scss';
import { stopEvent } from '../../services/events';
import Locales from '../../strings';
import ProblemSetShareModal from '../../components/Modals/ProblemSetShareModal';
import { FRONTEND_URL_PROTO } from '../../config';
import Step from '../../components/Step';
// import Select from '../../components/Select';

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class ProblemSet extends Component {
    textAreaRef = React.createRef();

    state = {
        layout: 'grid',
        modalVisible: false,
        assignModal: false,
        editingTitle: false,
        updatedTitleText: '',
        lastSavedTitle: '',
        currentProblem: 0,
    };

    componentDidMount() {
        const {
            action,
            code,
        } = this.props.match.params;
        if (action === 'new') {
            this.props.clearProblemSet();
            this.newProblemSet();
        } else {
            this.loadData(action, code);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            problemSet,
        } = nextProps;
        const { set } = problemSet;
        const { title } = set;
        if (title !== this.state.updatedTitleText) {
            this.setState({ updatedTitleText: title, lastSavedTitle: title });
        }
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    saveTitle = () => {
        const {
            problemSet,
        } = this.props;
        const { set } = problemSet;
        const { title } = set;
        const cleanedTitleText = (this.textAreaRef.current.value || '')
            .replace(/\r?\n|\r/g, '')
            .trim();
        if (cleanedTitleText === '') {
            this.setState({
                updatedTitleText: title,
            });
            this.textAreaRef.current.value = title;
            return;
        }
        if (set.title !== cleanedTitleText) {
            this.props.updateProblemSetTitle(cleanedTitleText);
            this.textAreaRef.current.value = cleanedTitleText;
        }
    }

    onEnter = (e) => {
        if (e.key === 'Enter') {
            return stopEvent(e);
        }
        return true;
    }

    handleKeyDown = (e) => {
        const rawText = e.target.value;
        this.setState({
            updatedTitleText: rawText,
        });
    }

    focusTitle = () => {
        this.contentEditable.current.focus();
        const inp = this.contentEditable.current;
        if (inp.createTextRange) {
            const part = inp.createTextRange();
            part.move('character', 0);
            part.select();
        } else if (inp.setSelectionRange) {
            inp.setSelectionRange(0, 0);
        }
        document.execCommand('selectAll', false, null);
    }

    handleTitleFocus = () => {
        this.textAreaRef.current.focus();
        document.execCommand('selectAll', false, null);
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

    archiveProblemSet = problemSet => (e) => {
        const {
            action,
        } = this.props.match.params;
        let archiveMode = null;
        const isSolutionSet = action === 'solve';
        if (!problemSet.archiveMode) {
            archiveMode = 'archived';
        }
        this.props.archiveProblemSet(
            problemSet.editCode, archiveMode, problemSet.title, isSolutionSet, '/app',
        );
        return stopEvent(e);
    }

    duplicateProblemSet = problemSet => (e) => {
        this.props.duplicateProblemSet(problemSet);
        return stopEvent(e);
    }

    getData = () => {
        const { problemSet } = this.props;
        const { set, solutions } = problemSet;
        if (solutions && solutions.length > 0) {
            return solutions;
        }
        return set.problems;
    }

    getLayout = () => {
        const { layout } = this.state;
        if (document.body.offsetWidth < 800) {
            return 'line-item';
        }
        return layout;
    }

    renderProblems = () => {
        const { problemSet, match } = this.props;
        const {
            action,
        } = match.params;
        const { set } = problemSet;
        if (action === 'view' || set.loading) {
            return null;
        }
        if (action === 'edit') {
            return (
                <div className={styles.problemContainer}>
                    {this.renderProblemSelector()}
                    {this.renderSelectedProblem()}
                </div>
            );
        }
        return (
            <>
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {this.getData()
                        .map((problem, index) => (
                            <Card
                                action={action}
                                layoutMode={this.getLayout()}
                                key={problem.id || index}
                                {...problem.problem}
                                {...problem}
                                problemPosition={index + 1}
                            />
                        ))
                    }
                </Row>
            </>
        );
    }

    renderProblemSelector = () => {
        const {
            match,
            problemSet,
        } = this.props;
        const {
            action,
        } = match.params;
        const { set, problemToEditIndex } = problemSet;
        const selectedIndex = problemToEditIndex || 0;
        const pageLength = 5;
        const startIndex = Math.min(
            Math.max(0, selectedIndex - (pageLength - 1) / 2),
            Math.max(0, set.problems.length - pageLength),
        );
        const endIndex = Math.min(set.problems.length - 1, startIndex + pageLength - 1);
        const range = Array(endIndex - startIndex + 1).fill().map((_, idx) => startIndex + idx);
        return (
            <div className={styles.stepActionsContainer}>
                <div className={styles.paginator}>
                    <Button
                        type="text"
                        size="large"
                        disabled={selectedIndex === 0}
                        icon={<FontAwesomeIcon icon={faArrowLeft} />}
                        onClick={() => { this.props.setEditProblem(selectedIndex - 1, action); }}
                        aria-label={Locales.strings.previous_problem.replace('{currentIndex}', selectedIndex + 1)}
                    />
                    {range.map((index, id) => (
                        <Button
                            key={`problemIndex-${id}`}
                            type="text"
                            size="large"
                            className={`${styles.paginatorBtn} ${index === selectedIndex ? styles.active : ''}`}
                            onClick={() => { this.props.setEditProblem(index, action); }}
                            aria-label={
                                `${Locales.strings.problem} ${index + 1}${index === selectedIndex ? (`, ${Locales.strings.active}`) : ''}`
                            }
                        >
                            {String(index + 1).padStart(2, '0')}
                        </Button>
                    ))}
                    <Button
                        type="text"
                        size="large"
                        disabled={(selectedIndex + 1) >= set.problems.length}
                        icon={<FontAwesomeIcon icon={faArrowRight} />}
                        onClick={() => { this.props.setEditProblem(selectedIndex + 1, action); }}
                        aria-label={Locales.strings.next_problem.replace('{currentIndex}', selectedIndex + 1)}
                    />
                </div>
                <Button
                    className={styles.addNewProblem}
                    type="text"
                    icon={<FontAwesomeIcon icon={faPlusCircle} />}
                    size="large"
                    onClick={() => {
                        this.props.addEmptyProblem();
                    }}
                    aria-label={Locales.strings.add_new_problem}
                />
            </div>
        );
    }

    renderSelectedProblem = () => {
        const {
            problemSet,
        } = this.props;
        const { set } = problemSet;
        if (!set.problems || set.problems.length === 0) {
            return null;
        }
        const editIndex = problemSet.problemToEditIndex || 0;
        const problem = set.problems[editIndex] || { text: '', title: '' };
        return (
            <div className={styles.stepContainer}>
                <Step
                    key={`${editIndex}-step`}
                    index={editIndex}
                    stepValue={problem.text}
                    explanation={problem.title}
                    explanationPlaceholder={Locales.strings.add_the_prompt}
                    solvePlaceholder={Locales.strings.type_the_problem}
                    hideHeading
                    isProblemSet
                />
            </div>
        );
    }

    renderHeader = () => {
        const {
            match,
            problemSet,
            userProfile,
        } = this.props;
        const {
            action,
        } = match.params;
        const { set } = problemSet;
        const { modalVisible } = this.state;

        if (!this.state.updatedTitleText) {
            return null;
        }

        const menu = (
            <Menu
                getPopupContainer={triggerNode => triggerNode.parentNode}
                className={styles.menu}
                onClick={(e) => {
                    stopEvent(e);
                }}
            >
                {action === 'edit' && (
                    <Menu.Item>
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faCopy} />}
                            onClick={e => this.duplicateProblemSet(set)(e.domEvent)}
                        >
                            {Locales.strings.duplicate}
                        </Button>
                    </Menu.Item>
                )}
                {action !== 'edit' && (
                    <Menu.Item>
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faShare} />}
                            onClick={() => {
                                this.setState({
                                    shareModal: true,
                                });
                            }}
                        >
                            {Locales.strings.share_my_work}
                        </Button>
                        <ProblemSetShareModal
                            problemList={problemSet}
                            shareLink={`${FRONTEND_URL_PROTO}/app/problemSet/review/${problemSet.problemSetShareCode}`}
                            isSolutionSet
                            centered
                            visible={this.state.shareModal}
                            onOk={() => {
                                this.setState({
                                    shareModal: false,
                                });
                            }}
                            onCancel={() => {
                                this.setState({
                                    shareModal: false,
                                });
                            }}
                        />
                    </Menu.Item>
                )}
                {userProfile.email && (
                    <Menu.Item>
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faMinusCircle} />}
                            onClick={() => {
                                this.setState({
                                    modalVisible: true,
                                });
                            }}
                        >
                            {Locales.strings.delete}
                        </Button>
                        <Modal
                            title={Locales.strings.confirm}
                            visible={modalVisible}
                            onOk={(e) => {
                                this.archiveProblemSet({
                                    ...problemSet,
                                    ...set,
                                })(e);
                                this.setState({
                                    modalVisible: false,
                                });
                            }}
                            onCancel={() => {
                                this.setState({
                                    modalVisible: false,
                                });
                            }}
                            okText={Locales.strings.okay}
                            cancelText={Locales.strings.cancel}
                        >
                            <p>{Locales.strings.delete_confirmation}</p>
                        </Modal>
                    </Menu.Item>
                )}
            </Menu>
        );

        const firstSmall = action === 'edit' ? 6 : 24;
        const firstLarge = action === 'edit' ? 6 : 18;
        const secondSmall = action === 'edit' ? 18 : 24;
        const secondLarge = action === 'edit' ? 18 : 6;

        return (
            <Row
                className={`justify-content-between ${styles.heading} ${action === 'edit' ? styles.editActionBar : ''}`}
                gutter={gutter}
            >
                <Col className={`gutter-row ${styles.topBar}`} xs={firstSmall} sm={firstSmall} md={firstLarge} lg={firstLarge} xl={firstLarge}>
                    <span className={styles.back}>
                        <Button
                            aria-label={Locales.strings.back_to_dashboard}
                            onClick={() => {
                                this.props.history.replace('/app');
                            }}
                            type="text"
                            icon={(
                                <>
                                    <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                                </>
                            )}
                        />
                    </span>
                    {action !== 'edit' && <span className={styles.title}>{set.title}</span>}
                </Col>
                <Col
                    className={`gutter-row ${styles.topBar} ${action === 'edit' ? styles.editRightSection : ''}`}
                    xs={secondSmall}
                    sm={secondSmall}
                    md={secondLarge}
                    lg={secondLarge}
                    xl={secondLarge}
                    onClick={(e) => {
                        stopEvent(e);
                    }}
                >
                    {action === 'edit' && (
                        <>
                            <Button
                                type="primary"
                                icon={<FontAwesomeIcon icon={faShare} />}
                                className={styles.assignSet}
                                onClick={() => {
                                    this.setState({
                                        assignModal: true,
                                    });
                                }}
                            >
                                {Locales.strings.assign_set}
                            </Button>
                            <ProblemSetShareModal
                                problemList={problemSet}
                                shareLink={`${FRONTEND_URL_PROTO}/app/problemSet/view/${set.shareCode}`}
                                centered
                                visible={this.state.assignModal}
                                onOk={() => {
                                    this.setState({
                                        assignModal: false,
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        assignModal: false,
                                    });
                                }}
                            />
                        </>
                    )}
                    {(action === 'edit' || userProfile.email) && (action !== 'review') && (
                        <Dropdown
                            overlay={menu}
                            placement="bottomRight"
                            className={styles.options}
                            overlayClassName={styles.dropdown}
                            trigger={['click']}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            <Button
                                type="text"
                                icon={<FontAwesomeIcon icon={faEllipsisH} size="4x" />}
                                onClick={(e) => {
                                    stopEvent(e);
                                }}
                            />
                        </Dropdown>
                    )}
                </Col>
                {action === 'edit' && (
                    <Col
                        xs={24}
                        className={styles.titleRow}
                        onFocus={() => this.textAreaRef.current.focus()}
                    >
                        <div className={styles.editTitleContainer}>
                            <Textarea
                                className={styles.titleText}
                                defaultValue={this.state.updatedTitleText}
                                maxLength="200"
                                // onKeyDown={this.onEnter}
                                onChange={this.handleKeyDown}
                                onBlur={this.saveTitle}
                                ref={this.textAreaRef}
                            />
                            <FontAwesomeIcon
                                forwardedRef={(ref) => { this.titleEditIcon = ref; }}
                                className={styles.editBtn}
                                icon={faPen}
                                onFocus={this.focusTitle}
                                onClick={this.focusTitle}
                            />
                        </div>
                    </Col>
                )}
            </Row>
        );
    }

    render() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderProblems()}
            </div>
        );
    }
}

export default connect(
    state => ({
        problemSetList: state.problemSetList,
        problemSet: state.problemSet,
        userProfile: state.userProfile,
        ui: state.ui,
        routerHooks: state.routerHooks,
        router: state.router,
    }),
    {
        ...problemSetListActions,
        ...problemSetActions,
    },
)(ProblemSet);
