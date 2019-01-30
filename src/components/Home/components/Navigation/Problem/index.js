import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import { EDIT_PROBLEM, CONFIRMATION, ADD_PROBLEMS } from '../../../../ModalContainer';
import problem from './styles.css';
import buttons from '../../../../Button/styles.css';
import Locales from '../../../../../strings';
import showImage from '../../../../../scripts/showImage';
import parseMathLive from '../../../../../scripts/parseMathLive';
import { SERVER_URL } from '../../../../../config';

const mathLive = DEBUG_MODE ? require('../../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../../lib/mathlivedist/mathlive.js');

const problemMathDisplayLength = 30;
const OPEN_TEXT_TAG = '\\text{';

export default class Problem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOverflownHorizontally: false,
            isOverflownVertically: false,
        };

        this.createNewSolution = this.createNewSolution.bind(this);
        this.onTrashClick = this.onTrashClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onImgClick = this.onImgClick.bind(this);
    }

    componentDidMount() {
        mathLive.renderMathInElement(this.navItemContent);
        const isOverflownVertically = this.navItemContent.scrollHeight
            > this.navItemContent.clientHeight;
        const isOverflownHorizontally = this.navItemContent.scrollWidth
            > this.navItemContent.clientWidth;
        this.setState({
            isOverflownVertically,
            isOverflownHorizontally,
        });
    }

    componentDidUpdate() {
        mathLive.renderMathInElement(this.navItemContent);
    }

    onTrashClick(e) {
        this.props.activateModals([CONFIRMATION], this.props.number);
        e.stopPropagation();
    }

    onEditClick(e) {
        this.props.activateModals([EDIT_PROBLEM], this.props.number);
        e.stopPropagation();
    }

    onImgClick(e) {
        showImage(this.props.problem.scratchpad);
        e.stopPropagation();
    }

    buildComplexProblemText() {
        const text = this.props.problem.text;
        const equationParts = text.split('{');
        let result = '';
        equationParts.forEach((part, i) => {
            if (part.length > problemMathDisplayLength) {
                result += `{${part.slice(0, problemMathDisplayLength)}...}`;
            } else {
                if (i !== 0) {
                    result += '{';
                }
                result += part;
            }
        });
        return result;
    }

    /* eslint-disable jsx-a11y/alt-text */
    buildProblemImage() {
        return (
            <img
                className={problem.image}
                src={this.props.problem.scratchpad}
                alt={Locales.strings.scratchpad_alt}
            />
        );
    }

    buildAnnotation() {
        let text = parseMathLive(this.props.problem.title);
        if ((text.match(/\\text{/g) || []).length > 1) {
            if (text.includes('\\frac')) {
                text = this.buildComplexProblemText();
            } else if (text.length > problemMathDisplayLength) {
                text = `${text.slice(0, problemMathDisplayLength)}...`;
            }
            return `$$${OPEN_TEXT_TAG}${this.props.number + 1}. }${text}}$$`;
        }
        return `${this.props.number + 1}. ${this.props.problem.title}`;
    }

    buildProblemText() {
        return `$$${this.props.problem.text}$$`;
    }

    createNewSolution(history) {
        if (this.props.example) {
            history.push('/problem/example/');
        } else {
            const solution = {
                problem: {
                    problemSetRevisionShareCode: this.props.problem.problemSetRevisionShareCode,
                    text: this.props.problem.text,
                    title: this.props.problem.title,
                },
                steps: [
                    {
                        stepValue: this.props.problem.text,
                        explanation: this.props.problem.title,
                    },
                ],
            };
            axios.post(`${SERVER_URL}/solution/`, solution)
                .then((response) => {
                    history.push(`/problem/edit/${response.data.editCode}`);
                });
        }
    }

    render() {
        let annotation;
        let equation;
        let equationFollowUp;
        let image;
        if (this.props.example) {
            annotation = Locales.strings.getting_started_title;
            equation = Locales.strings.getting_started_equation;
        } else if (this.props.addNew) {
            annotation = Locales.strings.add_problem_title;
        } else {
            annotation = this.buildAnnotation();
            equation = this.buildProblemText();
            equationFollowUp = this.state.isOverflownHorizontally || this.state.isOverflownVertically ? '...' : null;
            image = this.buildProblemImage();
        }

        const wrappedAnnotation = annotation !== undefined && (annotation.match(/\\text{/g) || []).length > 1
            ? <span className={problem.problemAnnotationScaled}>{annotation}</span>
            : <span className={problem.problemAnnotation}>{annotation}</span>;

        const speechForMath = (
            <span className="sROnly">
                {/* this.navItemContent --generate text -- .$text('spoken-text') */}
                dummy speech
            </span>
        );

        const imgButton = (this.props.problem && this.props.problem.scratchpad)
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problem.imgIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onImgClick}
                    name="image"
                />
            )
            : null;

        const plusButton = this.props.addNew
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problem.plusIcon,
                            'fa-2x',
                        )
                    }
                    name="plus-circle"
                />
            )
            : null;

        const editButton = this.props.showRemove
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problem.editIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onEditClick}
                    name="edit"
                />
            )
            : null;

        const removeButton = this.props.showRemove
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problem.trashIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onTrashClick}
                    name="trash"
                />
            )
            : null;

        const NavItem = withRouter(({ history }) => (
            <div
                id={`problem-${this.props.number + 1}`}
                className={
                    classNames(
                        'col-md-4',
                        'text-center',
                        problem.problem,
                    )
                }
            >
                <div
                    className={
                        classNames(
                            'btn',
                            buttons.default,
                            buttons.huge,
                            problem.navSpan,
                            problem.middle,
                        )
                    }
                >
                    <button
                        type="button"
                        className={
                            classNames(
                                problem.navItemButton,
                                problem.colorInherit,
                            )
                        }
                        onClick={() => (
                            this.props.addNew
                                ? this.props.activateModals([ADD_PROBLEMS])
                                : this.createNewSolution(history))}
                        onKeyPress={() => (
                            this.props.addNew
                                ? this.props.activateModals([ADD_PROBLEMS])
                                : this.createNewSolution(history))}
                        tabIndex="0"
                    >
                        {wrappedAnnotation}
                        <div
                            aria-hidden="true" // math speech is part of link
                            ref={(el) => { this.navItemContent = el; }}
                            className={classNames(
                                this.props.example ? null : problem.equation,
                                this.state.isOverflownHorizontally
                                    ? problem.equationOverflownHorizontally : null,
                                this.state.isOverflownVertically
                                    ? problem.equationOverflownVertically : null,
                            )}
                        >
                            {equation}
                        </div>
                        {speechForMath}
                    </button>
                    {imgButton}
                    {removeButton}
                    {plusButton}
                    {editButton}
                    <div className={classNames(
                        problem.navItemContent,
                        this.state.isOverflownHorizontally
                            ? problem.contentOverflownHorizontally : null,
                        this.state.isOverflownVertically
                            ? problem.contentOverflownVertically
                            : null,
                    )}
                    >
                        {equationFollowUp}
                    </div>
                    {this.props.problem && this.props.problem.scratchpad ? image : null}
                </div>
            </div>
        ));
        return <NavItem />;
    }
}
