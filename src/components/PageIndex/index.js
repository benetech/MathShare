import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainPageHeader from '../Home/components/Header';
import { requestDefaultRevision } from '../../redux/problemList/actions';
import googleAnalytics from '../../scripts/googleAnalytics';

const exampleProblemList = [
    {
        name: 'Solve for X',
        link: '/app/problemSet/view/VXTD7GVLUBZCK',
    },
    {
        name: 'Distance, Rate and Time',
        link: '/app/problemSet/view/U3HMD6SU6VTUE',
    },
    {
        name: 'Combining Like Terms',
        link: '/app/problemSet/view/PRL4UNUWXEU34',
    },
    {
        name: 'Using Equations to Solve Problems',
        link: '/app/problemSet/view/DNGQSFFYB2HCU',
    },
];

class Index extends Component {
    componentDidMount() {
        this.props.requestDefaultRevision();
    }

    openDefaultRevision = () => {
        const { props } = this;
        const { problemList } = props;
        props.history.push(`/app/problemSet/view/${problemList.defaultRevisionCode}`);
        googleAnalytics('premade set - default');
    }

    openExampleProblem = () => {
        this.props.history.push('/app/problemSet/view/E4AM5WVE4JRTC');
        googleAnalytics('viewed student example');
    }

    openPremadeSet = problemSet => () => {
        this.props.history.push(problemSet.link);
        googleAnalytics(`premade set - ${problemSet.name}`);
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
                            {exampleProblemList.map((exampleProblem, index) => (
                                <li className="col col-lg-3" key={index}>
                                    <button
                                        type="button"
                                        className="btn d-flex"
                                        onClick={this.openPremadeSet(exampleProblem)}
                                        onKeyPress={this.openPremadeSet(exampleProblem)}
                                        role="link"
                                        tabIndex="0"
                                    >
                                        <span className="centreText">{exampleProblem.name}</span>
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
    { requestDefaultRevision },
)(Index);
