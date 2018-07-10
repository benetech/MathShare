import React, { Component } from "react";
import ProblemHeader from './components/ProblemHeader';
import MyStepsHeader from './components/MySteps/components/MyStepsHeader'
import MyStepsList from './components/MySteps/components/MyStepsList';
import MyWork from './components/MyWork';
import editor from './styles.css';
import ProblemAPI from '../../api'

export default class Editor extends Component {
 
    render() {
        var problem = ProblemAPI.get(
            parseInt(this.props.match.params.number, 10)
        )

        return (
            <div className={editor.mainWrapper}>
                <div className={editor.alertContainer}></div>
                <div className={editor.contentWrapper} id="ContentWrapper">
                    <main id="MainWorkArea" className={editor.editorAndHistoryWrapper}>
                        <ProblemHeader title={problem.annotation} math={problem.equation}/>
                        <MyStepsHeader />
                        <MyStepsList />
                        <MyWork />
                    </main>
                </div>
            </div>
        )
    }
}