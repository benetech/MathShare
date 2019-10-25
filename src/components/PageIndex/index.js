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

    getShareLink = shareCode => `/#/app/problemSet/view/${shareCode}`

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
                    {userProfile.recentProblemSets.map(this.renderProblemSet)}
                </ol>
            );
        }
        return <div className="text-center">No recent problems</div>;
    }

    renderProblemSet = (problemSet, index) => (
        <li className="card" key={index}>
            <a
                className="btn d-flex"
                href={this.getShareLink(problemSet.shareCode)}
                onClick={this.openPremadeSet(problemSet)}
                onKeyPress={
                    passEventForKeys(this.openPremadeSet(problemSet))
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
                <div className="dropdown">
                    <button
                        className={`btn dropdown-toggle ${pageIndex.problemSetDropdown}`}
                        type="button"
                        id={`dropdownMenuButton-${index}`}
                        data-toggle="dropdown"
                        aria-haspopup="true"
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
                                    {Locales.strings.opens_in_new_window}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </a>
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
                        <li className="card">
                            <a
                                className="btn d-flex"
                                href={this.getShareLink(problemList.defaultRevisionCode)}
                                onClick={this.openExampleProblem}
                                onKeyPress={passEventForKeys(this.openExampleProblem)}
                            >
                                <span className="centreText">{Locales.strings.example_problem}</span>
                            </a>
                        </li>
                    </ol>
                    <div className="title">Recent</div>
                    {this.renderRecent()}
                    <div className="title">{Locales.strings.pre_made_sets}</div>
                    <ol className={pageIndex.problemSetList}>
                        {problemList.exampleProblemSets.filter(exampleProblemSet => exampleProblemSet.title !== 'Example Problem Set').map(this.renderProblemSet)}

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
