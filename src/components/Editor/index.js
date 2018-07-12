import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MyWork from './components/MyWork';
import editor from './styles.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.number;
        this.state = {
            math: this.getProblemById(props.problems, this.id).originalProblem.equation,
            title: this.getProblemById(props.problems, this.id).originalProblem.annotation,
            steps: this.getProblemById(props.problems, this.id).history
        };
    }

    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
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
