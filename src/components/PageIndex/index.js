import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntercomAPI } from 'react-intercom';
import MainPageHeader from '../Home/components/Header';
import { requestDefaultRevision, requestExampleSets } from '../../redux/problemList/actions';
import googleAnalytics from '../../scripts/googleAnalytics';


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
                    <div className="row">
                        <ol>
                            <li className="col col-lg-3">
                                <button
                                    type="button"
                                    className="btn d-flex"
                                    onClick={props.addProblemSet}
                                    onKeyPress={props.addProblemSet}
                                >
                                    <span className="centreText">+ New Problem Set</span>
                                </button>
                            </li>
                            <li className="col col-lg-3">
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
                    </div>
                    <div className="row">
                        <div className="title">Pre-made Sets</div>
                        <ol>
                            {problemList.exampleProblemSets.filter(exampleProblemSet => exampleProblemSet.title !== 'Example Problem Set').map((exampleProblemSet, index) => (
                                <li className="col col-lg-3" key={index}>
                                    <button
                                        type="button"
                                        className="btn d-flex"
                                        onClick={this.openPremadeSet(exampleProblemSet)}
                                        onKeyPress={this.openPremadeSet(exampleProblemSet)}
                                        role="link"
                                        tabIndex="0"
                                    >
                                        <span className="centreText">{exampleProblemSet.title}</span>
                                    </button>
                                </li>
                            ))}

                        </ol>
                    </div>
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
