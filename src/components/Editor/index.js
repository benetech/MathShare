import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MyWork from './components/MyWork';
import editor from './styles.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            math: props.problem.originalProblem.equation,
            title: props.problem.originalProblem.annotation,
            steps: props.problem.history
        };
    }

    render() {
        return (
            <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                <ProblemHeader math={this.state.math} title={this.state.title} />
                <MyStepsHeader />
                <MyStepsList steps={this.state.steps} />
                <MyWork />
            </main>
        );
    }
}
