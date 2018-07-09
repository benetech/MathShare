import React, {Component} from "react";
import Step from "./components/Step";
import classNames from "classnames";
import myStepsList from './styles.css';
import mySteps from '../../../../styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyStepsList extends Component {
    render() {
        return (
            <div id="HistoryWrapper" className={mySteps.historyWrapper}>
                <div className={bootstrap.row} data-step="4"
                     data-intro="Review your work. The trash icon also allows you to delete and rework a prior step.">
                    <div className={bootstrap['col-lg-12']}>
                        <div className={classNames(bootstrap['container-fluid'], myStepsList.list)}
                            id="MathHistory" role="heading" aria-level="2">
                            <Step stepNumber="1" math="math" annotation="annotation" showEdit="true" showTrash="true"/>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}
