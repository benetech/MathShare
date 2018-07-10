import React, { Component } from "react";
import Button from '../../.././../Button';
import classNames from "classnames";
import problem from './styles.css';
import buttons from '../../../../../components/Button/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class Problem extends Component {
    render() {
        return (
            <li
                className={
                    classNames(
                        bootstrap['col-md-4'],
                        bootstrap['text-center'],
                        problem.problem
                    )
                }
            >
                <span
                    className={
                        classNames(
                            bootstrap.btn,
                            buttons.default,
                            buttons.huge
                        )
                    }
                >

                    <Button
                        className={
                            classNames(
                                problem.navItemButton,
                                problem.colorInherit
                            )
                        }
                        content={<span className={problem.problemAnnotation}>{this.props.annotation}</span>}
                    />
                    <span className={problem.problemEquation}>{this.props.equation}</span>
                </span>
            </li>
        );
    }
}
