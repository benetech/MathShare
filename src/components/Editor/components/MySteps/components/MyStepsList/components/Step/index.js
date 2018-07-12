import React, { Component } from "react";
import Button from '../../../../../../../../components/Button';
import classNames from "classnames";
import step from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import mathLive from 'mathlive';

export default class Step extends Component {
    OrdinalSuffix(i) {
        var j = i % 10,
                k = i % 100;
        if (j == 1 && k != 11) {
                return i + "st";
        }
        if (j == 2 && k != 12) {
                return i + "nd";
        }
        if (j == 3 && k != 13) {
                return i + "rd";
        }
        return i + "th";
    }

    buildReason() {
        if (this.props.cleanup) {
            return (<span className={styles.sROnly}> {this.OrdinalSuffix(this.props.stepNumber)} step, after cleanup</span>);
        } else {
            return (
                <div>
                    <span className={styles.sROnly}> {this.OrdinalSuffix(this.props.stepNumber)} step</span>
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
                            Edit {this.OrdinalSuffix(this.props.stepNumber)} step
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
                            Delete {this.OrdinalSuffix(this.props.stepNumber)} step
                        </span>
                    }
                //TODO onclick="DeleteActiveMath()"
                />
            );
        }
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
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
                    <span className="staticMath" >{this.props.math}</span>
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
