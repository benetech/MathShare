import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import step from './styles.css';
import Locales from '../../../../../../../../strings';
import showImage from '../../../../../../../../scripts/showImage';

import '../../../../../../../../../images/pencil.png';
import '../../../../../../../../../images/delete.png';

const mathLive = DEBUG_MODE ? require('../../../../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../../../../lib/mathlivedist/mathlive.js');

export default class Step extends Component {
    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    /**
    Convert number to ordinal -- checked with NVDA that 2nd will read as "second", etc.
    From https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
    The rules are as follows:
    st is used with numbers ending in 1 (e.g. 1st, pronounced first)
    nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
    rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
    As an exception to the above rules, all the "teen" numbers ending with 11, 12 or 13 use -th
    (e.g. 11th, pronounced eleventh, 112th, pronounced one hundred [and] twelfth)
    th is used for all other numbers (e.g. 9th, pronounced ninth).
    * */
    OrdinalSuffix = (i) => {
        if (Locales.strings.getLanguage() === 'en') {
            const j = i % 10;


            const k = i % 100;
            if (j === 1 && k !== 11) {
                return `${i}st`;
            }
            if (j === 2 && k !== 12) {
                return `${i}nd`;
            }
            if (j === 3 && k !== 13) {
                return `${i}rd`;
            }
            return `${i}th`;
        }
        return null;
    }

    buildReason() {
        if (this.props.cleanup) {
            return (
                <span className="sROnly">
                    {' '}
                    {this.OrdinalSuffix(this.props.stepNumber)}
                    {' '}
                    {Locales.strings.step_after_cleanup}
                </span>
            );
        }
        return (
            <div className={step.reason}>
                <span className="sROnly">
                    {' '}
                    {this.OrdinalSuffix(this.props.stepNumber)}
                    {' '}
                    {Locales.strings.step}
                </span>
                <span className={step.header} aria-hidden="true">
                    {Locales.strings.step}
                    {' '}
                    {this.props.stepNumber}
:
                </span>
            </div>
        );
    }

    buildEditBtn() {
        if (this.props.showEdit) {
            return (
                <Button
                    id={`editStepBtn-${this.props.stepNumber}`}
                    className={
                        classNames(
                            'btn',
                            step.btnEdit,
                            step.button,
                        )
                    }
                    additionalStyles={['background', 'palette']}
                    data-toggle="tooltip"
                    title={Locales.strings.edit_this_step}
                    content={(
                        <span className="sROnly">
                            {Locales.strings.edit}
                            {' '}
                            {this.OrdinalSuffix(this.props.stepNumber)}
                            {' '}
                            {Locales.strings.step}
                        </span>
                    )}
                    onClick={() => this.props.editStepCallback(this.props.stepNumber)}
                />
            );
        }
        return undefined;
    }

    buildTrashBtn() {
        if (this.props.showTrash && !this.props.cleanup) {
            return (
                <Button
                    id={`deleteStepBtn-${this.props.stepNumber}`}
                    className={
                        classNames(
                            'btn',
                            step.btnDelete,
                            step.button,
                        )
                    }
                    additionalStyles={['background', 'palette', 'withLeftMargin']}
                    data-toggle="tooltip"
                    title={Locales.strings.delete_this_step}
                    content={(
                        <span className="sROnly">
                            {Locales.strings.delete}
                            {' '}
                            {this.OrdinalSuffix(this.props.stepNumber)}
                            {' '}
                            {Locales.strings.step}
                        </span>
                    )}
                    onClick={() => this.props.deleteStepCallback(false, true)}
                />
            );
        }
        return undefined;
    }

    /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
    render() {
        const clearAll = this.props.stepNumber === 1 && !this.props.readOnly
            ? (
                <Button
                    id="clearAllStepsBtn"
                    className={classNames([
                        'btn',
                        step.clearAll,
                        step.button,
                    ])}
                    data-toggle="tooltip"
                    title={Locales.strings.clear_all_title}
                    disabled={!this.props.showClearAll}
                    content={Locales.strings.clear_all}
                    icon="times-circle"
                    onClick={this.props.deleteStepsCallback}
                />
            ) : null;

        const id = this.props.cleanup ? `mathStep-${this.props.stepNumber - 1}-cleanup`
            : `mathStep-${this.props.stepNumber}`;
        return (
            <div id={id} className={classNames('row', step.step)}>
                <div className="col-md-1">
                    <span role="heading" aria-level="3">
                        {this.buildReason()}
                    </span>
                </div>
                <div className={classNames('col-md-4', step.annotationEquation)}>
                    <span className="sROnly">
                        {' '}
                        {Locales.strings.math}
:
                        {' '}
                    </span>
                    <span className="staticMath">{`$$${this.props.math}$$`}</span>
                </div>
                <div className={classNames('col-md-4', step.annotationEquation)}>
                    <span className="sROnly" role="heading" aria-level="4">
                        {Locales.strings.reason}
:
                    </span>
                    <span className={classNames({
                        [step.cleanUpAnnotation]: this.props.cleanup,
                    })}
                    >
                        {' '}
                        {this.props.annotation}
                        {' '}

                    </span>
                </div>
                <div className={classNames('col-md-2', step.annotationEquation)}>
                    {/* eslint-disable jsx-a11y/alt-text */}
                    <img
                        role="button"
                        className={step.image}
                        src={this.props.scratchpad}
                        onClick={() => showImage(this.props.scratchpad)}
                        onKeyPress={() => showImage(this.props.scratchpad)}
                    />
                </div>
                <div className={classNames('col-md-1', step.btnContainer)}>
                    {clearAll}
                    {this.buildEditBtn()}
                    {this.buildTrashBtn()}
                </div>
            </div>
        );
        /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
    }
}
