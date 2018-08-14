import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import Button from '../../.././../Button';
import classNames from "classnames";
import problem from './styles.css';
import buttons from '../../../../../components/Button/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../../strings';
import config from '../../../../../../package.json';
import axios from 'axios';

const mathLive = DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../lib/mathlivedist/mathlive.js');

export default class Problem extends Component {
    constructor(props) {
        super(props);

        this.createNewSolution = this.createNewSolution.bind(this);
    }

    buildAnnotation() {
        return (this.props.number + 1) + ". " + this.props.problem.title;
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    createNewSolution(history) {
        var solution = {
            problem: {
                problemSetRevisionShareCode: this.props.problem.problemSetRevisionShareCode,
                text: this.props.problem.text,
                title: this.props.problem.title
            },
            steps: [
                {
                    stepValue: this.props.problem.text,
                    explaination: this.props.problem.title
                }
            ]
        }
        axios.post(`${config.serverUrl}/solution/new`, solution)
            .then(response => {
                history.push('/problem/view/' + response.data.shareCode);
            })
    }

    render() {
        var annotation;
        var equation;
        if (this.props.example) {
            annotation = Locales.strings.getting_started_title;
            equation = Locales.strings.getting_started_equation;
        } else {
            annotation = this.buildAnnotation();
            equation = "$$" + this.props.problem.text + "$$";
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
                onClick={() => this.createNewSolution(history)}
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
                        onClick={() => this.createNewSolution(history)}
                    />
                    <span className={problem.problemEquation}>{equation}</span>
                </span>
            </li>
        ))
        return <NavItem />
    }
}
