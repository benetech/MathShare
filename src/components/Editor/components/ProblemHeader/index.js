import React, { Component } from "react";
import Button from '../../../../components/Button';
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class ProblemHeader extends Component {
    render() {
        return (
            <div className={problem.header}>
                <div>
                    <span id="ProblemTitle" className={problem.title} role="heading" aria-level="1">{this.props.title}</span>
                    <span id="ProblemMath" className={problem.title}>{this.props.math}</span>
                </div>
                <div className={problem.btnContainer}>
                    <Button
                        id="BtnSave"
                        className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                        additionalStyles={['default']}
                        ariaHidden="true"
                        type="button"
                        content="Help"
                    //TODO: onclick="introJs().setOption('tooltipClass', 'introjs-helperLayer').start(); GoogleAnalytics('Tour');"
                    />
                </div>
            </div>
        );
    }
}
