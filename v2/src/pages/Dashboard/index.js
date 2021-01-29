import {
    faBars, faPlusCircle, faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button, Row, Col, Radio,
} from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as dayjs from 'dayjs';
import Card from '../../components/Card';
import problemSetListActions from '../../redux/problemSetList/actions';
import problemSetActions from '../../redux/problemSet/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import { stopEvent } from '../../services/events';
import Locales from '../../strings';
import styles from './styles.scss';
// import Select from '../../components/Select';

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class Dashboard extends Component {
    state = {
        layout: 'grid',
    };

    componentDidMount() {
        this.props.requestExampleSets();
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    handleDropdownSelect = (e) => {
        console.log('e', e);
    }

    duplicateProblemSet = problemSet => (e) => {
        this.props.duplicateProblemSet(problemSet);
        return stopEvent(e);
    }

    newProblemSet = () => {
        this.props.setTempPalettes([
            'Edit',
            'Operators',
            'Notations',
            'Geometry',
        ]);

        this.props.saveProblemSet([], `${Locales.strings.new_problem_set} ${dayjs().format('MM-DD-YYYY')}`, null);
    }

    archiveProblemSet = problemSet => (e) => {
        let archiveMode = null;
        const isSolutionSet = !problemSet.problems;
        if (!problemSet.archiveMode) {
            archiveMode = 'archived';
        }
        this.props.archiveProblemSet(
            problemSet.editCode, archiveMode, problemSet.title, isSolutionSet,
        );
        return stopEvent(e);
    }

    getLayout = () => {
        const { layout } = this.state;
        if (document.body.offsetWidth < 800) {
            return 'line-item';
        }
        return layout;
    }

    renderExampleSets() {
        const { problemSetList } = this.props;
        if (problemSetList.exampleProblemSets.loading) {
            return null;
        }
        const allowedSets = ['Example Problem Set', 'Combining Like Terms', 'Solve for X'];
        return (
            <>
                <div className={styles.heading} id="example_sets">
                    <span className={styles.title}>{Locales.strings.example_sets}</span>
                </div>
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {problemSetList.exampleProblemSets.data
                        .filter(exampleSet => allowedSets.includes(exampleSet.title))
                        .map(exampleSet => (
                            <Card
                                key={exampleSet.id}
                                {...exampleSet}
                                layoutMode={this.getLayout()}
                                isExampleSet
                                duplicateProblemSet={this.duplicateProblemSet(exampleSet)}
                            />
                        ))
                    }
                </Row>
            </>
        );
    }

    renderSetsCommon(key) {
        const { problemSetList, userProfile } = this.props;
        const setData = problemSetList[key];
        if (setData.loading && setData.data.length === 0) {
            return (
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {Locales.strings.loading}
                </Row>
            );
        }
        if (setData.data.length === 0 && key === 'recentSolutionSets') {
            return (
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {Locales.strings.you_dont_have_any_sets}
                </Row>
            );
        }
        return (
            <>
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {setData.data
                        .map(recentSet => (
                            <Card
                                key={recentSet.id}
                                {...recentSet}
                                problemSet={{
                                    ...recentSet,
                                    set: recentSet,
                                    problemSetShareCode: recentSet.reviewCode,
                                }}
                                duplicateProblemSet={this.duplicateProblemSet(recentSet)}
                                archiveProblemSet={this.archiveProblemSet(recentSet)}
                                userProfile={userProfile}
                                layoutMode={this.getLayout()}
                                isRecent
                            />
                        ))
                    }
                </Row>
                <Row className={styles.loadMoreContainer}>
                    {setData.showLoadMore && (
                        <Button
                            className={styles.loadMore}
                            type="primary"
                            loading={setData.loading}
                            onClick={() => this.props.fetchRecentWork(
                                Math.min(
                                    ...setData.data.map(item => item.id),
                                ),
                                key,
                            )}
                        >
                            {Locales.strings.load_more}
                        </Button>
                    )}
                </Row>
            </>
        );
    }

    renderSetsContainer(key, title, isFirst) {
        const { userProfile, ui } = this.props;

        return (
            <>
                <Row
                    className={`justify-content-between ${styles.heading}`}
                    gutter={gutter}
                >
                    <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={12} lg={12} xl={12} id={title.replace(/ /g, '_').toLowerCase()}>
                        <span className={styles.title}>{title}</span>
                    </Col>
                    {isFirst && !ui.sideBarCollapsed && (
                        <Col className={`col-auto ${styles.setButtons}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div className={`btn-group ${styles.layoutBtns}`} role="group">
                                <Radio.Group
                                    buttonStyle="solid"
                                    onChange={this.setLayout}
                                    size="large"
                                    value={this.state.layout}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Radio.Button value="line-item">
                                        <FontAwesomeIcon icon={faBars} />
                                    </Radio.Button>
                                    <Radio.Button value="grid">
                                        <FontAwesomeIcon icon={faThLarge} />
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                            {/* <Select
                            dropdownClassName={styles.select}
                            options={options}
                            size="large"
                            defaultValue="most_recent"
                        /> */}
                        </Col>
                    )}
                </Row>
                {key === 'recentProblemSets' && (
                    <Row className={`${styles.problemSetGrid} ${this.getLayout()} ${styles.newProblemSetContainer}`}>
                        <Button
                            type="ghost"
                            icon={<FontAwesomeIcon icon={faPlusCircle} />}
                            aria-label="Add New Problem Set"
                            onClick={this.newProblemSet}
                        >
                            New Problem Set
                        </Button>
                    </Row>
                )}
                {userProfile.email && this.renderSetsCommon(key)}
            </>
        );
    }

    renderSignInBanner() {
        const { userProfile } = this.props;
        if (userProfile.email) {
            return null;
        }
        return (
            <p className={styles.linkContainer}>
                You&apos;re not logged in --
                {' '}
                <a className={styles.link} href="/#/login">log in</a>
                {' '}
                to view your problem sets.
            </p>
        );
    }

    render() {
        const { userProfile } = this.props;
        // const options = [
        //     {
        //         value: 'most_recent',
        //         label: 'Most Recent',
        //     },
        //     {
        //         value: 'assigned_to_me',
        //         label: 'Assigned to Me',
        //     },
        //     {
        //         value: 'Created by me',
        //         label: 'Created by Me',
        //     },
        // ];

        if (userProfile.userType === 'student') {
            return (
                <div style={{ padding: '20px' }}>
                    {this.renderSetsContainer('recentSolutionSets', Locales.strings.my_solution_sets, true)}
                    {userProfile.email && this.renderSetsContainer('recentProblemSets', Locales.strings.my_created_sets)}
                    {this.renderExampleSets()}
                </div>
            );
        }

        return (
            <div style={{ padding: '20px' }}>
                {this.renderSetsContainer('recentProblemSets', userProfile.email ? Locales.strings.my_created_sets : Locales.strings.my_sets, true)}
                {this.renderSignInBanner()}
                {userProfile.email && this.renderSetsContainer('recentSolutionSets', Locales.strings.my_solution_sets)}
                {this.renderExampleSets()}
            </div>
        );
    }
}

export default connect(
    state => ({
        problemSetList: state.problemSetList,
        userProfile: state.userProfile,
        ui: state.ui,
        routerHooks: state.routerHooks,
        router: state.router,
    }),
    {
        ...problemSetActions,
        ...problemSetListActions,
        fetchRecentWork,
    },
)(Dashboard);
