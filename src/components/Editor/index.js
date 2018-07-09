import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader';
import MyStepsList from './components/MySteps/components/MyStepsList';
import MyWork from './components/MyWork';
import editor from './styles.css';

export default class Editor extends Component {
    render() {
        return (
            <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                <ProblemHeader />
                <MyStepsHeader />
                <MyStepsList />
                <MyWork />
            </main>
        );
    }
}
