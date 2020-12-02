import {
    faBars, faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button, Row, Col, Radio,
} from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Card from '../../components/Card';
import problemSetListActions from '../../redux/problemSetList/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import styles from './styles.scss';
import { stopEvent } from '../../services/events';
// import CopyLink from '../../components/CopyLink';
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
                <div className={styles.heading}>
                    <span className={styles.title}>Example Sets</span>
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

    renderRecentSets() {
        const { problemSetList, userProfile } = this.props;
        const { recentSolutionSets } = problemSetList;
        if (recentSolutionSets.loading && recentSolutionSets.data.length === 0) {
            return (
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    Loading...
                </Row>
            );
        }
        if (recentSolutionSets.data.length === 0) {
            return (
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    You don&apos;t have any sets yet!
                    {' '}
                    Try solving an example problem set below,
                    {' '}
                    or create your own using the desktop version of Mathshare.
                </Row>
            );
        }
        return (
            <>
                <Row className={`${styles.problemSetGrid} ${this.getLayout()}`}>
                    {recentSolutionSets.data
                        .map(recentProblemSet => (
                            <Card
                                key={recentProblemSet.id}
                                {...recentProblemSet}
                                duplicateProblemSet={this.duplicateProblemSet(recentProblemSet)}
                                archiveProblemSet={this.archiveProblemSet(recentProblemSet)}
                                userProfile={userProfile}
                                layoutMode={this.getLayout()}
                                isRecent
                            />
                        ))
                    }
                </Row>
                <Row className={styles.loadMoreContainer}>
                    {problemSetList.showLoadMore && (
                        <Button
                            className={styles.loadMore}
                            type="primary"
                            loading={problemSetList.recentSolutionSets.loading}
                            onClick={() => this.props.fetchRecentWork(
                                Math.min(
                                    ...problemSetList.recentSolutionSets.data.map(item => item.id),
                                ),
                            )}
                        >
                            Load More
                        </Button>
                    )}
                </Row>
            </>
        );
    }

    render() {
        const { userProfile, ui } = this.props;
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

        return (
            <div style={{ padding: '20px' }}>
                <Row
                    className={`justify-content-between ${styles.heading}`}
                    gutter={gutter}
                >
                    <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <span className={styles.title}>Your Sets</span>
                    </Col>
                    {!ui.sideBarCollapsed && (
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
                {/* <Row>
                    <CopyLink />
                </Row> */}
                {userProfile.email && this.renderRecentSets()}
                {!userProfile.email && (
                    <p className={styles.linkContainer}>
                        You&apos;re not logged in --
                        {' '}
                        <a className={styles.link} href="/#/login">log in</a>
                        {' '}
                        to view your problem sets.
                    </p>
                )}
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
        ...problemSetListActions,
        fetchRecentWork,
    },
)(Dashboard);
