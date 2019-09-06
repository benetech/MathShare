/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';
import { requestDefaultRevision, requestExampleSets } from '../../redux/problemList/actions';
import { fetchRecentWork } from '../../redux/userProfile/actions';
import googleAnalytics from '../../scripts/googleAnalytics';
import pageIndex from './styles.scss';
import { stopEvent } from '../../services/events';

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
        const { props } = this;
        const { problemList } = props;
        props.history.push(`/app/problemSet/view/${problemList.defaultRevisionCode}`);
        googleAnalytics('premade set - default');
        IntercomAPI('trackEvent', 'view-example-set');
    }

    openSet = problemSet => () => {
        if (problemSet.isExample) {
            this.openByShareCode(problemSet.shareCode);
            googleAnalytics(`premade set - ${problemSet.title}`);
        } else {
            this.openByEditCode(problemSet.editCode);
        }
    }

    openByShareCode = (shareCode) => {
        this.props.history.push(`/app/problemSet/view/${shareCode}`);
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
                <div className="text-center">
                    <span className={pageIndex.signInLink} role="link" tabIndex={0} onClick={this.redirectToSignIn} onKeyPress={this.redirectToSignIn}>
                        Sign in
                    </span>
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
        <li className="card" key={problemSet.id}>
            <button
                type="button"
                className="btn d-flex"
                onClick={this.openSet(problemSet)}
                onKeyPress={this.openSet(problemSet)}
                role="link"
                tabIndex="0"
            >
                <span className={pageIndex.title}>
                    {problemSet.title}
                </span>
                <span className={pageIndex.meta}>
                    {problemSet.problemCount}
                    {' '}
                    Problems
                </span>
                <div className="dropdown">
                    <button
                        className={`btn dropdown-toggle ${pageIndex.problemSetDropdown}`}
                        type="button"
                        id={`dropdownMenuButton-${index}`}
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={stopEvent}
                    >
                        <FontAwesome
                            name="ellipsis-v"
                        />
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a
                            className="dropdown-item"
                            onClick={this.duplicateProblemSet(
                                problemSet,
                            )}
                            onKeyPress={this.duplicateProblemSet(
                                problemSet,
                            )}
                            role="link"
                            tabIndex="0"
                        >
                            <FontAwesome
                                size="lg"
                                name="copy"
                            />
                            {` ${Locales.strings.duplicate_set}`}
                        </a>
                        <a
                            className="dropdown-item"
                            onClick={shareOnTwitter(
                                problemSet.shareCode,
                            )}
                            onKeyPress={shareOnTwitter(
                                problemSet.shareCode,
                            )}
                            role="link"
                            tabIndex="0"
                        >
                            <FontAwesome
                                size="lg"
                                name="twitter"
                            />
                            {` ${Locales.strings.share_with_teachers}`}
                        </a>
                    </div>
                </div>
            </button>
        </li>
    )

    render() {
        const { props } = this;
        const { problemList } = props;
        return (
            <div>
                <MainPageHeader
                    {...props}
                    editing={false}
                    history={props.history}
                    addProblemSetCallback={props.addProblemSet}
                    finishEditing={props.finishEditing}
                    editCode={problemList.set.editCode}
                    action={null}
                />
                <div className="mainContainer">
                    <ol className={pageIndex.problemSetList}>
                        <li className="card">
                            <button
                                type="button"
                                className="btn d-flex"
                                onClick={props.addProblemSet}
                                onKeyPress={props.addProblemSet}
                            >
                                <span className="centreText">+ New Problem Set</span>
                            </button>
                        </li>
                        <li className="card">
                            <button
                                type="button"
                                className="btn d-flex"
                                onClick={this.openExampleProblem}
                                onKeyPress={this.openExampleProblem}
                                role="link"
                                tabIndex="0"
                            >
                                <span className="centreText">Example Problem</span>
                            </button>
                        </li>
                    </ol>
                    <div className="title">Recent</div>
                    {this.renderRecent()}
                    <br />
                    <br />
                    <div className="title">Pre-made Sets</div>
                    <ol className={pageIndex.problemSetList}>
                        {problemList.exampleProblemSets.map(set => ({ ...set, isExample: true })).filter(exampleProblemSet => exampleProblemSet.title !== 'Example Problem Set').map(this.renderProblemSet)}

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
