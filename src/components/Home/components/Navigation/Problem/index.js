import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import Button from '../../.././../Button';
import classNames from "classnames";
import problem from './styles.css';
import buttons from '../../../../../components/Button/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

const mathLive = DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../lib/mathlivedist/mathlive.js');

export default class Problem extends Component {
    buildAnnotation() {
        return (this.props.number + 1) + ". " + this.props.problem.annotation;
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    render() {
        var annotation;
        var equation;
        if (this.props.example) {
            annotation = "Getting Started";
            equation = "Click here to see an example problem and learn how to use the editor";
        } else {
            annotation = this.buildAnnotation();
            equation = "$$" + this.props.problem.equation + "$$";
        }
        const NavItem = withRouter(({ history }) => (
            <li
                className={
                    classNames(
                        bootstrap['col-md-4'],
                        bootstrap['text-center'],
                        problem.problem
                    )
                }
                onClick={() => {history.push('/problem/' + this.props.id)}}
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
                        onClick={() => {history.push('/problem/' + this.props.id)}}
                    />
                    <span className={problem.problemEquation}>{equation}</span>
                </span>
            </li>
        ))
        return <NavItem/>
    }
}
