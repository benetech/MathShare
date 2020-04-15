import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { push, replace } from 'connected-react-router';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import { Helmet } from 'react-helmet';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';
import Button from '../Button';
import {
    archiveProblemSet,
    requestArchivedSets,
    requestDefaultRevision,
    requestExampleSets,
} from '../../redux/problemList/actions';
import { setDropdownId } from '../../redux/ui/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import googleAnalytics from '../../scripts/googleAnalytics';
import pageIndex from './styles.scss';
import { stopEvent, passEventForKeys } from '../../services/events';
import CommonDropdown from '../CommonDropdown';

// const shareOnTwitter = shareCode => (e) => {
//     window.open(
//         `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${Locales.strings.share_with_teachers_text} ${window.location.origin}/#/app/problemSet/view/${shareCode}`)}`, '_blank',
//     );
//     return stopEvent(e);
// };


class Index extends Component {
    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.archiveMode === nextProps.archiveMode
            && this.props.router.location.pathname === nextProps.router.location.pathname) {
            return;
        }
        this.loadData();
    }

    loadData = () => {
        this.props.requestArchivedSets();
        this.props.requestDefaultRevision();
        this.props.requestExampleSets();
        this.props.fetchRecentWork();
    }

    openExampleProblem = () => {
        googleAnalytics('premade set - default');
        IntercomAPI('trackEvent', 'view-example-set');
    }

    openPremadeSet = problemSet => () => {
        googleAnalytics(`premade set - ${problemSet.title}`);
    }

    getLink = (problemSet, isRecent) => {
        if (!isRecent) {
            return `/#/app/problemSet/view/${problemSet.shareCode}`;
        }
        let action = 'edit';
        if (problemSet.solutions) {
            action = 'solve';
        }
        return `/#/app/problemSet/${action}/${problemSet.editCode}`;
    }

    openByEditCode = (editCode) => {
        this.props.history.push(`/app/problemSet/edit/${editCode}`);
    }

    duplicateProblemSet = problemSet => (e) => {
        this.props.duplicateProblemSet(e, problemSet);
        return stopEvent(e);
    }

    archiveProblemSet = problemSet => (e) => {
        let archiveMode = null;
        if (!problemSet.archiveMode) {
            archiveMode = 'archived';
        }
        this.props.archiveProblemSet(problemSet.editCode, archiveMode, problemSet.title);
        return stopEvent(e);
    }

    redirectToSignIn = () => {
        this.props.push('/signIn');
    }

    renderRecent = () => {
        const { props } = this;
        const { userProfile, archiveMode } = props;
        if (archiveMode) {
            return null;
        }
        let recentContent = null;
        if (!userProfile.service) {
            recentContent = (
                <div className={`text-center ${pageIndex.signInContainer}`}>
                    <a className={pageIndex.signInLink} href="/#/signIn">
                        Sign in
                    </a>
                    {' '}
                    to track your problem sets
                </div>
            );
        } else if (userProfile.recentProblemSets === null) {
            recentContent = <div className="text-center">{Locales.strings.loading}</div>;
        } else if (userProfile.recentProblemSets.length > 0) {
            recentContent = (
                <ol className={pageIndex.problemSetList} aria-labelledby="recent-sets-header">
                    {userProfile.recentProblemSets.map(this.renderProblemSet(false, true))}
                </ol>
            );
        } else {
            recentContent = <div className="text-center">No recent problems</div>;
        }
        return (
            <>
                {userProfile.email && userProfile.info.userType !== 'student' && (
                    <a className={`pull-right btn btn-primary ${pageIndex.archivedList}`} href="/#/app/archived">
                        {Locales.strings.archived_sets}
                    </a>
                )}
                <h2 id="recent-sets-header" className="title">{Locales.strings.recent_sets}</h2>
                {recentContent}
            </>
        );
    }

    dropdownOnClick = dropdownBtnId => (e) => {
        stopEvent(e);
        const { dropdownOpen } = this.props.ui;
        if (dropdownOpen === dropdownBtnId) {
            this.props.setDropdownId(null);
        } else {
            this.props.setDropdownId(dropdownBtnId);
        }
    }

    goBack = () => {
        this.props.replace('/app');
    }

    renderProblemSet = (isPremade, isRecent) => (problemSet, index) => {
        const isExample = isPremade && problemSet.title === 'Example Problem Set';
        const dropdownBtnId = `dropdownMenuButton-${(problemSet.shareCode && (`id-${problemSet.shareCode}`)) || index}`;
        return (
            <li className="card" key={index}>
                <a
                    className="btn d-flex"
                    href={this.getLink(problemSet, isRecent)}
                    onClick={isExample ? this.openExampleProblem() : this.openPremadeSet(
                        problemSet,
                    )}
                    onKeyPress={
                        passEventForKeys(
                            isExample ? this.openExampleProblem() : this.openPremadeSet(problemSet),
                        )
                    }
                >
                    <span className={pageIndex.title}>
                        {problemSet.title}
                    </span>
                    <span className={pageIndex.meta}>
                        {(problemSet.problems || problemSet.solutions).length}
                        {' '}
                        {Locales.strings.problems}
                    </span>
                </a>
                {problemSet.problems && (
                    <CommonDropdown
                        btnId={dropdownBtnId}
                        btnClass={pageIndex.problemSetDropdown}
                        containerClass={pageIndex.dropdownContainer}
                        btnContent={(
                            <span className="sROnly">
                                {Locales.strings.more_options_for.replace('{title}', problemSet.title)}
                            </span>
                        )}
                        btnIcon="ellipsis-v"
                        listClass={pageIndex.dropdownList}
                    >
                        <button
                            className="dropdown-item reset-btn"
                            onClick={this.duplicateProblemSet(
                                problemSet,
                            )}
                            onKeyPress={
                                passEventForKeys(
                                    this.duplicateProblemSet(
                                        problemSet,
                                    ),
                                )
                            }
                            type="button"
                        >
                            <FontAwesome
                                size="lg"
                                name="copy"
                            />
                            {` ${Locales.strings.duplicate_set}`}
                            <span className="sROnly">
                                {'\u00A0'}
                                {Locales.strings.opens_in_new_tab}
                            </span>
                        </button>
                        {isRecent && (
                            <button
                                className="dropdown-item reset-btn"
                                onClick={this.archiveProblemSet(
                                    problemSet,
                                )}
                                onKeyPress={
                                    passEventForKeys(
                                        this.archiveProblemSet(
                                            problemSet,
                                        ),
                                    )
                                }
                                type="button"
                            >
                                <FontAwesome
                                    size="lg"
                                    name={problemSet.archiveMode === 'archived' ? 'refresh' : 'trash'}
                                />
                                {` ${problemSet.archiveMode === 'archived' ? Locales.strings.restore : Locales.strings.archive}`}
                            </button>
                        )}
                    </CommonDropdown>
                )}
            </li>
        );
    }

    renderPremadeSets() {
        const { props } = this;
        const { problemList, archiveMode } = props;
        if (archiveMode) {
            return null;
        }
        return (
            <>
                <h2 id="pre-made-sets-header" className="title">{Locales.strings.pre_made_sets}</h2>
                <ol className={pageIndex.problemSetList} aria-labelledby="pre-made-sets-header">
                    {problemList.exampleProblemSets.map(this.renderProblemSet(true))}
                </ol>
            </>
        );
    }

    renderArchived() {
        const { props } = this;
        const { problemList, archiveMode } = props;
        if (!archiveMode) {
            return null;
        }
        let emptyList = null;
        if (problemList.archivedProblemSets === null) {
            emptyList = <div className="text-center">{Locales.strings.loading}</div>;
        } else if (problemList.archivedProblemSets.length === 0) {
            emptyList = <div className="text-center">{Locales.strings.archived_sets_empty}</div>;
        }
        return (
            <>
                <Button
                    id="backBtn"
                    className={classNames('btn', 'btn-primary', 'pointer', pageIndex.backBtn)}
                    type="button"
                    icon="arrow-left"
                    onClick={this.goBack}
                    tabIndex="-1"
                    ariaLabel={Locales.strings.back}
                    content={Locales.strings.back}
                />
                <h2 id="archived-sets-header" className="title">
                    {Locales.strings.archived_sets}
                </h2>
                {problemList.archivedProblemSets && (
                    <ol className={pageIndex.problemSetList} aria-labelledby="archived-sets-header">
                        {problemList.archivedProblemSets.map(this.renderProblemSet(false, true))}
                    </ol>
                )}
                {emptyList}
            </>
        );
    }

    renderTopButtons() {
        const { props } = this;
        const { archiveMode } = props;
        if (archiveMode) {
            return null;
        }
        return (
            <>
                <div className={pageIndex.problemSetList}>
                    <div className="card">
                        <button
                            id="add_problem_set"
                            type="button"
                            className="btn d-flex"
                            onClick={props.addProblemSet}
                            onKeyPress={passEventForKeys(props.addProblemSet)}
                        >
                            <span className="centreText">
                                +
                                {' '}
                                {Locales.strings.create_a_problem_set}
                            </span>
                        </button>
                    </div>
                </div>
            </>
        );
    }

    renderHeader = () => {
        const { routerHistory } = this.props;
        if (routerHistory.prev === '#/userDetails') {
            return (
                <h1 className={pageIndex.thanksHeader} tabIndex={-1}>
                    {Locales.strings.thanks_for_details}
                </h1>
            );
        }
        return (
            <h1 className="sROnly" tabIndex={-1}>{Locales.strings.dashboard}</h1>
        );
    }

    renderLibrary = () => {
        const { archiveMode } = this.props;
        if (archiveMode) {
            return null;
        }
        return (
            <div className="text-center">
                <h2 className="sROnly" tabIndex={-1}>{Locales.strings.problem_set_library}</h2>
                <span role="img" aria-label="" aria-hidden="true">📓</span>
                <a
                    href="https://docs.google.com/spreadsheets/d/1lI8NSnMWzt0K8hJDYDtxmL9fGHI8J2ku85P7uT3tp-0/edit?usp=sharing"
                >
                    {Locales.strings.explore_problem_set}
                </a>
            </div>
        );
    }

    renderMainDashboard = () => (
        <>
            {this.renderTopButtons()}
            {this.renderLibrary()}
            {this.renderRecent()}
            {this.renderArchived()}
            {this.renderPremadeSets()}
        </>
    )

    render() {
        const { props } = this;
        const { problemList, archiveMode } = props;
        let title = Locales.strings.all_problem_sets;
        if (archiveMode === 'archived') {
            title = Locales.strings.archived_sets;
        }
        return (
            <div>
                <Helmet>
                    <title>
                        {`${title} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <MainPageHeader
                    {...props}
                    editing={false}
                    history={props.history}
                    addProblemSetCallback={props.addProblemSet}
                    finishEditing={props.finishEditing}
                    editCode={problemList.set.editCode}
                    action={null}
                />
                <div id="mainContainer" className="mainContainer">
                    {this.renderHeader()}
                    {archiveMode ? this.renderArchived() : this.renderMainDashboard()}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        problemList: state.problemList,
        ui: state.ui,
        routerHistory: state.routerHooks,
        router: state.router,
    }),
    {
        archiveProblemSet,
        fetchRecentWork,
        replace,
        requestDefaultRevision,
        requestArchivedSets,
        requestExampleSets,
        push,
        setDropdownId,
    },
)(Index);
