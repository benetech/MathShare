import React, { Component } from "react";
import Button from '../../../../components/Button';
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemHeader extends Component {    
    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    tour() {
        introJs().setOption('tooltipClass', 'introjs-helperLayer').start();
        googleAnalytics('Tour');
    }

    render() {
        const title = this.props.title;
        var editOnlyControls = this.props.readOnly ? null :
        <div className={problem.btnContainer}>
                    <span className={problem.editLinkLabel}>{Locales.strings.edit_link_label}</span>
                    <input type="text" value={this.props.editLink} className={problem.editLink}/>
            <Button
                className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                additionalStyles={['default']}
                type="button"
                content={Locales.strings.share}
                onClick={this.props.shareProblem}/>
            <Button
                className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                additionalStyles={['default']}
                type="button"
                content={Locales.strings.save}
                onClick={this.props.saveProblem}/>
            <Button
                className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                additionalStyles={['default']}
                ariaHidden="true"
                type="button"
                content={Locales.strings.help}
                onClick={this.tour}/>
        </div>
        return (
            <div className={problem.header}>
                <div className={problem.backBtnContainer}>
                    <Button
                        className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                        additionalStyles={['default']}
                        ariaHidden="true"
                        type="button"
                        icon="arrow-left"
                        onClick={this.props.goBack}/>
                </div>
                <span id="ProblemTitle" className={problem.title} role="heading" aria-level="1">{title}</span>
                <span id="ProblemMath" className={problem.title}>{"$$" + this.props.math + "$$"}</span>
                {editOnlyControls}
            </div>
        );
    }
}
