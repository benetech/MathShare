import React from "react";
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class Problem extends React.Component {
    render() {
        return (
            <li className={classNames(bootstrap['col-md-4'], bootstrap['text-center'], problem.problem)}>
                <span className={classNames(bootstrap.btn, styles['btn-default'], styles['btn-huge'])}>
                    <button className={classNames(problem.navItemButton, problem.colorInherit)}>
                         <span className={problem.problemAnnotation}> {this.props.annotation} </span>
                    </button>
                    <span className={problem.problemEquation}> {this.props.equation} </span>
                </span> 
            </li>
        );
    }
}
