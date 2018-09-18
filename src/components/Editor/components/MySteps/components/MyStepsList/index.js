import React, { Component } from "react";
import Step from "./components/Step";
import classNames from "classnames";
import myStepsList from './styles.css';
import mySteps from '../../../../styles.css';
import MyWork from '../../../../components/MyWork';
import Locales from '../../../../../../strings';

export default class MyStepsList extends Component {
    constructor(props) {
        super(props);

        this.buildStep = this.buildStep.bind(this);
    }

    buildStep(i, value, explanation, isCleanup, isEdited, scratchpad) {
        var showTrash = false;
        var showEdit = false;
        if (i > 0 && !this.props.readOnly && !isEdited) {
            showEdit = true;
        }

        if (i == this.props.solution.steps.length - 1 && this.props.solution.steps.length > 1 && !this.props.readOnly) {
            showTrash = true;
        }

        return <div key={`${isCleanup}-${i}`} className={myStepsList.background} >
            <Step
                stepNumber={i + 1}
                math={value}
                annotation={explanation}
                cleanup={isCleanup}
                showEdit={showEdit && !isCleanup}
                showTrash={showTrash && !isCleanup}
                deleteStepCallback={this.props.deleteStepCallback}
                editStepCallback={this.props.editStepCallback}
                deleteStepsCallback={this.props.deleteStepsCallback}
                readOnly={this.props.readOnly}
                scratchpad={scratchpad} />
        </div>
    }

    render() {
        var steps = [];
        var i = 0;
        var cleanups = 0;
        this.props.solution.steps.forEach((step) => {
            var isEdited = this.props.editing && (i + cleanups == this.props.editorPosition);
            steps.push(this.buildStep(i++, step.stepValue, step.explanation, false, isEdited, step.scratchpad));
            if (step.cleanup) {
                cleanups++;
                steps.push(this.buildStep(i, step.cleanup, Locales.strings.cleanup, true));
            }
        });


        const myWork = this.props.readOnly ? null :
            <MyWork
                allowedPalettes={this.props.allowedPalettes}
                activateMathField={this.props.activateMathField}
                theActiveMathField={this.props.theActiveMathField}
                textAreaChanged={this.props.textAreaChanged}
                textAreaValue={this.props.textAreaValue}
                addStepCallback={this.props.addStepCallback}
                undoLastActionCallback={this.props.undoLastActionCallback}
                lastMathEquation={this.props.solution.steps[this.props.solution.steps.length - 1].stepValue}
                deleteStepsCallback={this.props.deleteStepsCallback}
                cancelEditCallback={this.props.cancelEditCallback}
                updateCallback={this.props.updateCallback}
                editing={this.props.editing}
                history={this.props.history}
                solution={this.props.solution}
                showUndo={this.props.showUndo}
                title={Locales.strings.my_work}
                bindDisplayFunction={this.props.bindDisplayFunction}
            />

            steps.splice(this.props.editorPosition + 1, 0,
                <div key={"editor"}>
                    <div className={classNames(myStepsList.background, myStepsList.padding)} />
                    {myWork}
                </div>
            );

        return (
            <div id="HistoryWrapper" className={mySteps.historyWrapper}>
                <div className={'row'} data-step="4"
                    data-intro={Locales.strings.history_data_intro}>
                    <div className={'col-lg-12'}>
                        <div
                            id="MathHistory"
                            className={
                                classNames(
                                    'container-fluid',
                                    myStepsList.list
                                )
                            }
                            role="heading"
                            aria-level="2">
                            {steps}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
