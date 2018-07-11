import React, { Component } from "react";
import Button from '../../.././../Button';
import classNames from "classnames";
import problem from './styles.css';
import buttons from '../../../../../components/Button/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class Problem extends Component {
    constructor(props) {
        super(props);
        if (!props.example) {
            this.state = {
                annotation: props.problem.originalProblem.annotation,
                equation: props.problem.originalProblem.equation,
                number: props.number
            };
        }
    }

    buildAnnotation() {
        return (this.state.number + 1) + ". " + this.state.annotation;
    }

    render() {
        var annotation;
        var equation;
        if (this.props.example) {
            annotation = "Getting Started";
            equation = "Click here to see an example problem and learn how to use the editor";
        } else {
            annotation = this.buildAnnotation();
            equation = this.state.equation;
        }
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
                        content={<span className={problem.problemAnnotation}>{annotation}</span>}
                    />
                    <span className={problem.problemEquation}>{equation}</span>
                </span>
            </li>
        );
    }
}
