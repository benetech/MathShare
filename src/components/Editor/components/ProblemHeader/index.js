import React, { Component } from "react";
import Button from '../../../../components/Button';
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import mathLive from '../../../../../src/lib/mathlivedist/mathlive.js';
import googleAnalytics from '../../../../scripts/googleAnalytics';

export default class ProblemHeader extends Component {
    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    tour() {
        googleAnalytics('Tour');
    }

    render() {
        const title = this.props.title;
        return (
            <div className={problem.header}>
                <div>
                    <span id="ProblemTitle" className={problem.title} role="heading" aria-level="1">{title}</span>
                    <span id="ProblemMath" className={problem.title}>{"$$" + this.props.math + "$$"}</span>
                </div>
                <div className={problem.btnContainer}>
                    <Button
                        className={classNames(bootstrap.btn, styles.pointer, problem.btn)}
                        additionalStyles={['default']}
                        ariaHidden="true"
                        type="button"
                        content="Help"
                        onClick={this.tour}
                    //TODO: onclick="introJs().setOption('tooltipClass', 'introjs-helperLayer').start();"
                    />
                </div>
            </div>
        );
    }
}
