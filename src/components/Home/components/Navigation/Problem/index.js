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
import FontAwesome from "react-fontawesome";
import showImage from '../../../../../scripts/showImage.js';

const mathLive = DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js')
: require('../../../../../lib/mathlivedist/mathlive.js');
const problemTextDisplayLength = 40;
const problemMathDisplayLength = 30;
const OPEN_TEXT_TAG = "\\text{";

export default class Problem extends Component {
    constructor(props) {
        super(props);

        this.createNewSolution = this.createNewSolution.bind(this);
        this.onTrashClick = this.onTrashClick.bind(this);
        this.onImgClick = this.onImgClick.bind(this);
    }

    buildAnnotation() {
        var text = this.parseMathLive(this.props.problem.title);
        return "$$" + OPEN_TEXT_TAG + (this.props.number + 1) + ". }" + text + "}$$";
    }

    parseMathLive(text) {
        var result = OPEN_TEXT_TAG;
        var textParts = text.split("$$");
        textParts.forEach(function(part, i) {
            if (i % 2) {
                result += "}" + part + OPEN_TEXT_TAG;
            } else {
                result += part;
            }
        })
        return result;
    }

    buildProblemText() {
        var text = this.props.problem.text;
        if (text.includes("\\frac")) {
            text = this.buildComplexProblemText();
        } else {
            if (text.length > problemTextDisplayLength) {
                text = text.slice(0, problemTextDisplayLength) + "...";
            }
        }
        return "$$" + text + "$$";
    }

    buildComplexProblemText() {
        var text = this.props.problem.text;
        var equationParts = text.split("{");
        var result = "";
        equationParts.forEach(function(part) {
            if (part.length > problemMathDisplayLength) {
                result += "{" + part.slice(0, problemMathDisplayLength) + "...}";
            } else {
                if (part.includes("}")) {
                    result += "{";
                }
                result +=  part;
            }
        });
        return result;
    }

    componentDidMount() {
        mathLive.renderMathInDocument();
    }

    onTrashClick(e) {
        this.props.deleteCallback("confirmation", this.props.number);
        e.stopPropagation();
    }

    onImgClick(e) {
        showImage(this.props.problem.scratchpad);
        e.stopPropagation();
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
                    explanation: this.props.problem.title
                }
            ]
        }
        axios.post(`${config.serverUrl}/solution/`, solution)
            .then(response => {
                history.push('/problem/edit/' + response.data.editCode);
            })
    }

    render() {
        var annotation;
        var equation;
        if (this.props.example) {
            annotation = Locales.strings.getting_started_title;
            equation = Locales.strings.getting_started_equation;
        } else if (this.props.addNew) {
            equation = Locales.strings.add_problem_title;
        } else {
            annotation = this.buildAnnotation();
            equation = this.buildProblemText();
        }

        var imgButton = (this.props.problem && this.props.problem.scratchpad) ? 
        <FontAwesome
            className={
                classNames(
                    problem.imgIcon,
                    'fa-2x'
                )
            }
            onClick={this.onImgClick}
            name='image'
        />
        : null;

        var plusButton = this.props.addNew ? 
        <FontAwesome
            className={
                classNames(
                    problem.plusIcon,
                    'fa-2x'
                )
            }
            name='plus-circle'
        />
        : null;
        
        var removeButton = this.props.showRemove ?  
        <FontAwesome
            className={
                classNames(
                    problem.trashIcon,
                    'fa-2x'
                )
            }
            onClick={this.onTrashClick}
            name='trash'
        />
        : null;

        const NavItem = withRouter(({ history }) => (
            <div
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
                            buttons.huge,
                            problem.navSpan
                        )
                    }
                    onClick={() => this.props.addNew ? this.props.activateModal("addProblems") : this.createNewSolution(history)}
                >
                    <Button
                        className={
                            classNames(
                                problem.navItemButton,
                                problem.annotation,
                                problem.colorInherit
                            )
                        }
                        content={<span className={problem.problemAnnotation}>{annotation}</span>}
                    />
                    {imgButton}
                    {removeButton}
                    {plusButton}
                    <span className={problem.problemEquation}>{equation}</span>
                </span>
            </div>
        ))
        return <NavItem />
    }
}
