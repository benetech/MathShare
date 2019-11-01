import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import { Helmet } from 'react-helmet';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';
import { requestDefaultRevision, requestExampleSets } from '../../redux/problemList/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import googleAnalytics from '../../scripts/googleAnalytics';
import pageIndex from './styles.scss';
import { stopEvent, passEventForKeys } from '../../services/events';

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

    renderProblemSet = (isExample, isRecent) => (problemSet, index) => (
        <li className="card" key={index}>
            <a
                className="btn d-flex"
                href={this.getLink(problemSet, isRecent)}
                onClick={isExample ? this.openExampleProblem() : this.openPremadeSet(problemSet)}
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
            <div className={`dropdown ${pageIndex.dropdownContainer}`}>
                <button
                    className={`btn dropdown-toggle ${pageIndex.problemSetDropdown}`}
                    type="button"
                    id={`dropdownMenuButton-${index}`}
                    data-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => {
                        stopEvent(e);
                    }}
                >
                    <FontAwesome
                        name="ellipsis-v"
                    />
                    <span className="sROnly">{Locales.strings.more_options}</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
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
                    </li>
                    <li>
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
                    </li>
                </ul>
            </div>
        </li>
    )

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
                    <h1 className="sROnly" tabIndex={-1}>{Locales.strings.dashboard}</h1>
                    <ol className={pageIndex.problemSetList}>
                        <li className="card">
                            <button
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
    }),
    {
        fetchRecentWork, requestDefaultRevision, requestExampleSets, push,
    },
)(Index);
