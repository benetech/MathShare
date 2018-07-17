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
        var problem = this.getProblemById(props.problems, this.id);
        this.state = {
            math: problem.originalProblem.equation,
            title: problem.originalProblem.annotation,
            steps: problem.history,
            allowedPalettes: this.props.allowedPalettes
        };
    }

    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
    }

    render() {
        var myWork;
        var myStepsList;
        var problemHeaderTitle = this.state.title;
        if (this.id != "newEditor") {
            myWork = <MyWork allowedPalettes={this.state.allowedPalettes} />;
            myStepsList = <MyStepsList steps={this.state.steps} />;
            problemHeaderTitle += ": ";
        }

        return (
            <div id="MainWorkWrapper" className={editor.mainWorkWrapper}>
                <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                    <ProblemHeader math={this.state.math} title={problemHeaderTitle} />
                    <MyStepsHeader />
                    {myStepsList}
                    {myWork}
                </main>
            </div>
        );
    }
}
