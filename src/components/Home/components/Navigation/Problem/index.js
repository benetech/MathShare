import React from "react";
import classNames from "classnames";
import problem from './styles.css';
import styles from '../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class Problem extends React.Component {
    render() {
        return (
            <li className={
                classNames({
                    [bootstrap['col-md-4']]: true,
                    [bootstrap['text-center']]: true,
                    [problem.problem]: true
                })}>
                <span className={
                    classNames({
                        [bootstrap.btn]: true,
                        [styles['btn-default']]: true,
                        [styles['btn-huge']]: true,
                    })}>
                    <button className={
                        classNames({
                            [problem.navItemButton]: true,
                            [problem.colorInherit]: true
                        })}>
                         <span className={problem.problemAnnotation}> {this.props.annotation} </span>
                    </button>
                    <span className={problem.problemEquation}> {this.props.equation} </span>
                </span> 
            </li>
        );
    }
}
