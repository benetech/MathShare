import {
    faArrowLeft, faCopy, faEllipsisH, faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Row, Col, Button, Dropdown, Menu, Popconfirm,
} from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Card from '../../components/ProblemCard';
import problemSetListActions from '../../redux/problemSetList/actions';
import problemSetActions from '../../redux/problemSet/actions';
import styles from './styles.scss';
import { stopEvent } from '../../services/events';
import Locales from '../../strings';
// import CopyLink from '../../components/CopyLink';
// import Select from '../../components/Select';

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class ProblemSet extends Component {
    state = {
        layout: 'grid',
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
        const { ui } = this.props;
        if (ui.sideBarCollapsed) {
            return 'line-item';
        }
        return layout;
    }

    renderProblems() {
        const { problemSet } = this.props;
        const { set } = problemSet;
        if (set.loading) {
            return null;
        }
        return (
            <>
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {this.getData()
                        .map((problem, index) => (
                            <Card
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

    render() {
        const {
            match,
            problemSet,
            userProfile,
        } = this.props;
        const {
            action,
        } = match.params;
        const { set } = problemSet;

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
                {userProfile.email && (
                    <Menu.Item>
                        <Popconfirm
                            title={Locales.strings.delete_confirmation}
                            okText={Locales.strings.okay}
                            cancelText={Locales.strings.cancel}
                            onConfirm={e => this.archiveProblemSet({
                                ...problemSet,
                                ...set,
                            })(e.domEvent)}
                        >
                            <Button
                                type="text"
                                icon={<FontAwesomeIcon icon={faMinusCircle} />}
                            >
                                {Locales.strings.delete}
                            </Button>
                        </Popconfirm>
                    </Menu.Item>
                )}
            </Menu>
        );

        return (
            <div>
                <Row
                    className={`justify-content-between ${styles.heading}`}
                    gutter={gutter}
                >
                    <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={18} lg={18} xl={18}>
                        <span className={styles.back}>
                            <Button
                                aria-label={Locales.strings.back_to_all_sets}
                                onClick={() => {
                                    this.props.history.replace('/app');
                                }}
                                type="text"
                                icon={(
                                    <>
                                        <span />
                                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                                    </>
                                )}
                            />
                        </span>
                        <span className={styles.title}>{set.title}</span>
                    </Col>
                    <Col
                        className={`gutter-row ${styles.topBar}`}
                        xs={24}
                        sm={24}
                        md={6}
                        lg={6}
                        xl={6}
                        onClick={(e) => {
                            stopEvent(e);
                        }}
                    >
                        {(action === 'edit' || userProfile.email) && (
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
                </Row>
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
