import React, { Component } from "react";
import Button from '../../../../../../../../components/Button';
import classNames from "classnames";
import step from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../../../../../strings'

const mathLive = DEBUG_MODE ? require('../../../../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../../../../lib/mathlivedist/mathlive.js');

export default class Step extends Component {
    /**
    Convert number to ordinal -- checked with NVDA that 2nd will read as "second", etc.
    From https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
    The rules are as follows:
    st is used with numbers ending in 1 (e.g. 1st, pronounced first)
    nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
    rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
    As an exception to the above rules, all the "teen" numbers ending with 11, 12 or 13 use -th (e.g. 11th, pronounced eleventh, 112th, pronounced one hundred [and] twelfth)
    th is used for all other numbers (e.g. 9th, pronounced ninth).
    **/
    OrdinalSuffix(i) {
        if (Locales.strings.getLanguage() === 'en') {
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
    }

    buildReason() {
        if (this.props.annotation == Locales.strings.cleanup) {
            return (<span className={styles.sROnly}> {this.OrdinalSuffix(this.props.stepNumber)} {Locales.strings.step_after_cleanup}</span>);
        } else {
            return (
                <div>
                    <span className={styles.sROnly}> {this.OrdinalSuffix(this.props.stepNumber)} {Locales.strings.step}</span>
                    <span className={step.header} aria-hidden="true">{Locales.strings.step} {this.props.stepNumber}:</span>
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
                    title={Locales.strings.edit_this_step}
                    content={
                        <span className={styles.sROnly}>
                            {Locales.strings.edit} {this.OrdinalSuffix(this.props.stepNumber)} {Locales.strings.step}
                        </span>
                    }
                    onClick={() => this.props.editStepCallback(this.props.exposedKey)}
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
                    additionalStyles={['background', 'palette', 'withLeftMargin']}
                    data-toggle="tooltip"
                    title={Locales.strings.delete_this_step}
                    content={
                        <span className={styles.sROnly}>
                            {Locales.strings.delete} {this.OrdinalSuffix(this.props.stepNumber)} {Locales.strings.step}
                        </span>
                    }
                    onClick={() => this.props.deleteStepCallback(false, true)}
                />
            );
        }
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    render() {
        const clearAll = this.props.stepNumber == 1 && !this.props.readOnly ?
            <Button
                className={classNames([
                    bootstrap.btn,
                    step.clearAll,
                    step.btn
                ])}
                content={Locales.strings.clear_all}
                icon="times-circle"
                onClick={this.props.deleteStepsCallback}
            /> : null;

        return (
            <div id="mathStep" className={classNames(bootstrap.row, step.step)} data-step={this.props.stepNumber}
                data-equation={this.props.math} data-annotation={this.props.annotation}>
                <div className={bootstrap['col-md-1']}>
                    <span role="heading" aria-level="3">
                        {this.buildReason()}
                    </span>
                </div>
                <div className={classNames(bootstrap['col-md-5'], step.annotationEquation)}>
                    <span className={styles.sROnly}> {Locales.strings.math}: </span>
                    <span className="staticMath" >{"$$" + this.props.math + "$$"}</span>
                </div>
                <div className={classNames(bootstrap['col-md-5'], step.annotationEquation)}>
                    <span className={styles.sROnly} role="heading" aria-level="4">{Locales.strings.reason}:</span>
                    <span className={classNames({
                        [step.cleanUpAnnotation]: this.props.annotation === "(cleanup)"
                    })}> {this.props.annotation} </span>
                </div>
                <div className={classNames(bootstrap['col-md-1'], step.btnContainer)}>
                    {clearAll}
                    {this.buildEditBtn()}
                    {this.buildTrashBtn()}
                </div>
            </div>

        );
    }
}
