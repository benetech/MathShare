import React, { Component } from "react";
import Button from '../../../../../../../../components/Button';
import classNames from "classnames";
import step from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyStepsHeader extends Component {


    buildReason() {
        if (this.props.cleanup) {
            return (<span className={styles.sROnly}> {OrdinalSuffix(this.props.stepNumber)} step, after cleanup</span>);
        } else {
            return (
                <div>
                    <span className={styles.sROnly}> {OrdinalSuffix(this.props.stepNumber)} step</span>
                    <span className={step.header} aria-hidden="true">Step {this.props.stepNumber}:</span>
                </div>
            );
        }
    }

    buildEditBtn() {
        if (this.props.showEdit) {
            return (
                <Button
                    className={
                        classNames(
                            bootstrap.btn,
                            step.btnEdit,
                            step.btn
                        )
                    }
                    additionalStyles={['background', 'palette']}
                    data-toggle="tooltip"
                    title="Edit this Step"
                    content={
                        <span className={styles.sROnly}>
                            Edit {OrdinalSuffix(this.props.stepNumber)} step
                        </span>
                    }
                //TODO onclick="EditMathStep('+ stepNumber + ')"
                />
            );
        }
    }

    buildTrashBtn() {
        if (this.props.showTrash) {
            return (
                <Button
                    className={
                        classNames(
                            bootstrap.btn,
                            step.btnDelete,
                            step.btn
                        )
                    }
                    additionalStyles={['background', 'palette']}
                    data-toggle="tooltip"
                    title="Delete this Step"
                    content={
                        <span className={styles.sROnly}>
                            Delete {OrdinalSuffix(this.props.stepNumber)} step
                        </span>
                    }
                //TODO onclick="DeleteActiveMath()"
                />
            );
        }
    }

    render() {
        return (
            <div className={classNames(bootstrap.row, step.step)} data-step={this.props.stepNumber}
                data-equation={this.props.math} data-annotation={this.props.annotation}>
                <div className={bootstrap['col-md-1']}>
                    <span role="heading" aria-level="3">
                        {this.buildReason()}
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
                    {this.buildEditBtn()}
                    {this.buildTrashBtn()}
                </div>
            </div>

        );
    }
}

