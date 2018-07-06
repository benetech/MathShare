import React from "react";
import classNames from "classnames";
import step from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import buttons from '../../../../../../../../styles/buttons.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyStepsHeader extends React.Component {
    render() {
        var reason = buildReason(this.props);
        var editBtn = buildEditBtn(this.props);
        var trashBtn = buildTrashBtn(this.props);

        return (
            <div className={classNames(bootstrap.row, step.step)} data-step={this.props.stepNumber}
                data-equation={this.props.math} data-annotation={this.props.annotation}>
                <div className={bootstrap['col-md-1']}>
                    <span role="heading" aria-level="3">
                        {reason}
                    </span>
                </div>
                <div className={bootstrap['col-md-5']}>
                    <span className={styles.sROnly}> math: </span>
                    <span className="staticMath" >$${this.props.math}$$</span>
                </div>
                <div className="col-md-5">
                    <span className={styles.sROnly} role="heading" aria-level="4">reason:</span>
                    <span className={classNames({
                        [step.annotation]: this.props.annotation == "cleanup"
                    })}> {this.props.annotation} </span>
                </div>
                <div className={classNames(bootstrap['col-md-1'], step.btnContainer)}>
                    {editBtn}
                    {trashBtn}
                </div>
            </div>

        );
    }
}

function buildReason(props) {
    if (props.cleanup) {
        return (<span className={styles.sROnly}> {OrdinalSuffix(props.stepNumber)} step, after cleanup</span>);
    } else {
        return (
            <div>
                <span className={styles.sROnly}> {OrdinalSuffix(props.stepNumber)} step</span>
                <span className={step.header} aria-hidden="true">Step {props.stepNumber}:</span>
            </div>
        );
    }
}

function buildEditBtn(props) {
    if (props.showEdit) {
        return (
            <button className={classNames(bootstrap.btn, step.btnEdit, buttons.background, buttons.palette, step.btn)}
                data-toggle="tooltip" title="Edit this Step"
            //onclick="EditMathStep('+ stepNumber + ')"
            >
                <span className={styles.sROnly}>Edit {OrdinalSuffix(props.stepNumber)} step</span>
            </button>
        );
    }
}

function buildTrashBtn(props) {
    if (props.showTrash) {
        return (
            <button className={classNames(bootstrap.btn, step.btnDelete, buttons.background, buttons.palette, step.btn)}
                data-toggle="tooltip" title="Delete this Step"
            //onclick="DeleteActiveMath()"
            >
                <span className={styles.sROnly}>Delete {OrdinalSuffix(props.stepNumber)} step</span>
            </button>
        );
    }
}
