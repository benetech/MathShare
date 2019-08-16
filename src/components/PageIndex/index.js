/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntercomAPI } from 'react-intercom';
import FontAwesome from 'react-fontawesome';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';
import { requestDefaultRevision, requestExampleSets } from '../../redux/problemList/actions';
import googleAnalytics from '../../scripts/googleAnalytics';
import pageIndex from './styles.scss';


const stopEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
};

const shareOnTwitter = editCode => (e) => {
    window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${Locales.strings.share_with_teachers_text} ${window.location.origin}/#/app/problemSet/edit/${editCode}`)}`, '_blank',
    );
    return stopEvent(e);
};


class Index extends Component {
    componentDidMount() {
        this.props.requestDefaultRevision();
        this.props.requestExampleSets();
    }

    openExampleProblem = () => {
        const { props } = this;
        const { problemList } = props;
        props.history.push(`/app/problemSet/view/${problemList.defaultRevisionCode}`);
        googleAnalytics('premade set - default');
        IntercomAPI('trackEvent', 'view-example-set');
    }

    openPremadeSet = problemSet => () => {
        this.openByShareCode(problemSet.shareCode);
        googleAnalytics(`premade set - ${problemSet.title}`);
    }

    openByShareCode = (shareCode) => {
        this.props.history.push(`/app/problemSet/view/${shareCode}`);
    }

    duplicateProblemSet = problemSet => (e) => {
        this.props.duplicateProblemSet(e, problemSet);
        return stopEvent(e);
    }

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

                    <div className="title">Pre-made Sets</div>
                    <ol className={pageIndex.problemSetList}>
                        {problemList.exampleProblemSets.filter(exampleProblemSet => exampleProblemSet.title !== 'Example Problem Set').map((exampleProblemSet, index) => (
                            <li className="card" key={index}>
                                <button
                                    type="button"
                                    className="btn d-flex"
                                    onClick={this.openPremadeSet(exampleProblemSet)}
                                    onKeyPress={this.openPremadeSet(exampleProblemSet)}
                                    role="link"
                                    tabIndex="0"
                                >
                                    <span className={pageIndex.title}>
                                        {exampleProblemSet.title}
                                    </span>
                                    <span className={pageIndex.meta}>
                                        {exampleProblemSet.problems.length}
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
                                            onClick={(e) => {
                                                stopEvent(e);
                                            }}
                                        >
                                            <FontAwesome
                                                name="ellipsis-v"
                                            />
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a
                                                className="dropdown-item"
                                                onClick={this.duplicateProblemSet(
                                                    exampleProblemSet,
                                                )}
                                                onKeyPress={this.duplicateProblemSet(
                                                    exampleProblemSet,
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
                                                    exampleProblemSet.editCode,
                                                )}
                                                onKeyPress={shareOnTwitter(
                                                    exampleProblemSet.editCode,
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
                        ))}

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
    { requestDefaultRevision, requestExampleSets },
)(Index);
