import React from "react";
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../styles/styles.css';
import buttons from '../../../../styles/buttons.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class ProblemHeader extends React.Component {
    render() {
        return (
            <div className={problem.header}>
                <div>
                    <span id="ProblemTitle" className={problem.title} role="heading" aria-level="1">{this.props.title}</span>
                    <span id="ProblemMath" className={problem.title}>{this.props.math}</span>
                </div>
                <div className={problem.btnContainer}>
                    <button aria-hidden='true'
                        //TODO: onclick="introJs().setOption('tooltipClass', 'introjs-helperLayer').start(); GoogleAnalytics('Tour');"
                        className={classNames(bootstrap.btn, styles.pointer, buttons.default, problem.btn)}
                        type="button">
                        Help
                    </button>
                </div>
            </div>
        );
    }
}
