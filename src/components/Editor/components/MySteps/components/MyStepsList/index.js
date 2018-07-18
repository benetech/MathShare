import React, {Component} from "react";
import Step from "./components/Step";
import classNames from "classnames";
import myStepsList from './styles.css';
import mySteps from '../../../../styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyStepsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: props.steps
        };
    }

    render() {
        var counter = 0;
        const steps = this.state.steps.map( (step, i) => {
            var showTrash = false;
            var showEdit = false;
            if (i > 0) {
                showEdit = true;
            }

            if (i == this.state.steps.length - 1 && this.state.steps.length > 1) {
                showTrash = true;
            }
            return <Step
                key={i}
                stepNumber={step.annotation==="(cleanup)" ? counter : counter++}
                math={step.equation}
                annotation={step.annotation}
                showEdit={showEdit}
                showTrash={showTrash}
                deleteStepCallback={this.props.deleteStepCallback}/>
            }
        );

        return (
            <div id="HistoryWrapper" className={mySteps.historyWrapper}>
                <div className={bootstrap.row} data-step="4"
                     data-intro="Review your work. The trash icon also allows you to delete and rework a prior step.">
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
                            aria-level="2"
                        >
                            {steps}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
