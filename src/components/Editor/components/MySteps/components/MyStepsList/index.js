import React, {Component} from "react";
import Step from "./components/Step";
import classNames from "classnames";
import myStepsList from './styles.css';
import mySteps from '../../../../styles.css';
import MyWork from '../../../../components/MyWork';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../../../strings';

export default class MyStepsList extends Component {
    constructor(props) {
        super(props);

        this.buildStep = this.buildStep.bind(this);
    }

    buildStep(i, value, explanation, isCleanup) {
        var showTrash = false;
        var showEdit = false;
        if (i > 0 && !this.props.readOnly) {
            showEdit = true;
        }

        if (i == this.props.solution.steps.length - 1 && this.props.solution.steps.length > 1 && !this.props.readOnly) {
            showTrash = true;
        }
      
        return <Step
                key={`${isCleanup}-${i}`}
                stepNumber={i + 1}
                math={value}
                annotation={explanation}
                cleanup={isCleanup}
                showEdit={showEdit && !isCleanup}
                showTrash={showTrash && !isCleanup}
                deleteStepCallback={this.props.deleteStepCallback}
                editStepCallback={this.props.editStepCallback}
                deleteStepsCallback={this.props.deleteStepsCallback}
                readOnly={this.props.readOnly} />
    }
    
    render() {
        var steps = [];
        var counter = 0;
        this.props.solution.steps.forEach((step) => {
            steps.push(this.buildStep(counter++, step.stepValue, step.explanation, false));
            if (step.cleanup) {
                steps.push(this.buildStep(counter, step.cleanup, Locales.strings.cleanup, true));
            }
        });

        if (!this.props.readOnly) {
            steps.splice(this.props.editorPosition + 1, 0, 
                <MyWork
                    key={"editor"}
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
                    updateStepCallback={this.props.updateStepCallback}
                    editing={this.props.editing}
                    history={this.props.history}
                    solution={this.props.solution}
                    openScratchpad={this.props.openScratchpad}
                    showUndo={this.props.showUndo}
                    title={Locales.strings.my_work} />
            )
        }

        return (
            <div id="HistoryWrapper" className={mySteps.historyWrapper}>
                <div className={bootstrap.row} data-step="4"
                     data-intro={Locales.strings.history_data_intro}>
                    <div className={bootstrap['col-lg-12']}>
                        <div
                            id="MathHistory"
                            className={
                                classNames(
                                    bootstrap['container-fluid'],
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
