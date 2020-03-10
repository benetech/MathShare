import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import { Helmet } from 'react-helmet';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';
import { archiveProblemSet, requestDefaultRevision, requestExampleSets } from '../../redux/problemList/actions';
import { setDropdownId } from '../../redux/ui/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import googleAnalytics from '../../scripts/googleAnalytics';
import pageIndex from './styles.scss';
import { stopEvent, passEventForKeys } from '../../services/events';
import CommonDropdown from '../CommonDropdown';

const shareOnTwitter = shareCode => (e) => {
    window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${Locales.strings.share_with_teachers_text} ${window.location.origin}/#/app/problemSet/view/${shareCode}`)}`, '_blank',
    );
    return stopEvent(e);
};


class Index extends Component {
    componentDidMount() {
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
        return `/#/app/problemSet/edit/${problemSet.editCode}`;
    }

    openByEditCode = (editCode) => {
        this.props.history.push(`/app/problemSet/edit/${editCode}`);
    }

    duplicateProblemSet = problemSet => (e) => {
        this.props.duplicateProblemSet(e, problemSet);
        return stopEvent(e);
    }

    archiveProblemSet = problemSet => (e) => {
        this.props.archiveProblemSet(problemSet.editCode);
        return stopEvent(e);
    }

    redirectToSignIn = () => {
        this.props.push('/signIn');
    }

    renderRecent = () => {
        const { userProfile } = this.props;
        if (!userProfile.service) {
            return (
                <div className={`text-center ${pageIndex.signInContainer}`}>
                    <a className={pageIndex.signInLink} href="/#/signIn">
                        Sign in
                    </a>
                    {' '}
                    to track your problem sets
                </div>
            );
        } if (userProfile.recentProblemSets === null) {
            return <div className="text-center">Loading...</div>;
        } if (userProfile.recentProblemSets.length > 0) {
            return (
                <ol className={pageIndex.problemSetList}>
                    {userProfile.recentProblemSets.map(this.renderProblemSet(false, true))}
                </ol>
            );
        }
        return <div className="text-center">No recent problems</div>;
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

    renderProblemSet = (isExample, isRecent) => (problemSet, index) => {
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
                        {problemSet.problems.length}
                        {' '}
                        {Locales.strings.problems}
                    </span>
                </a>
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
                    <button
                        className="dropdown-item reset-btn"
                        onClick={shareOnTwitter(
                            problemSet.shareCode,
                        )}
                        onKeyPress={passEventForKeys(shareOnTwitter(
                            problemSet.shareCode,
                        ))}
                        type="button"
                    >
                        <FontAwesome
                            size="lg"
                            name="twitter"
                        />
                        {` ${Locales.strings.share_on_twitter}`}
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
                                name="trash"
                            />
                            {` ${Locales.strings.archive}`}
                        </button>
                    )}
                </CommonDropdown>
            </li>
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

    render() {
        const { props } = this;
        const { problemList } = props;
        return (
            <div>
                <Helmet>
                    <title>
                        {`${Locales.strings.all_problem_sets} - ${Locales.strings.mathshare_benetech}`}
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
                    <ol className={pageIndex.problemSetList}>
                        <li className="card">
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
                                    {Locales.strings.new_problem_set}
                                </span>
                            </button>
                        </li>
                        {problemList.exampleProblemSets.filter(exampleProblemSet => exampleProblemSet.title === 'Example Problem Set').map(this.renderProblemSet(true))}
                    </ol>
                    <div className="text-center">
                        <span role="img" aria-label="Library">📓</span>
                        <a
                            href="https://docs.google.com/spreadsheets/d/1lI8NSnMWzt0K8hJDYDtxmL9fGHI8J2ku85P7uT3tp-0/edit?usp=sharing"
                        >
                            {Locales.strings.explore_problem_set}
                        </a>
                    </div>
                    <div className="title">{Locales.strings.recent}</div>
                    {this.renderRecent()}
                    <div className="title">{Locales.strings.pre_made_sets}</div>
                    <ol className={pageIndex.problemSetList}>
                        {problemList.exampleProblemSets.filter(exampleProblemSet => exampleProblemSet.title !== 'Example Problem Set').map(this.renderProblemSet())}
                    </ol>
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
    }),
    {
        archiveProblemSet,
        fetchRecentWork,
        requestDefaultRevision,
        requestExampleSets,
        push,
        setDropdownId,
    },
)(Index);
