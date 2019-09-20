import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import {
    EDIT_PROBLEM, CONFIRMATION, ADD_PROBLEMS, ADD_PROBLEM_SET,
} from '../../../../ModalContainer';
import problemStyle from './styles.scss';
import buttons from '../../../../Button/styles.scss';
import Locales from '../../../../../strings';
import showImage from '../../../../../scripts/showImage';
import parseMathLive from '../../../../../scripts/parseMathLive';
import { SERVER_URL } from '../../../../../config';
import { stopEvent, passEventForKeys } from '../../../../../services/events';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../../mathlive/src/mathlive.js').default
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
        return stopEvent(e);
    }

    onEditClick(e) {
        this.props.setEditProblem(this.props.number, this.props.action);
        this.props.activateModals([EDIT_PROBLEM], this.props.number);
        return stopEvent(e);
    }

    onImgClick(e) {
        showImage(this.props.problem.scratchpad);
        return stopEvent(e);
    }

    buildComplexProblemText = () => {
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

    buildProblemImage = () => (
        <img
            className={problemStyle.image}
            src={this.props.problem.scratchpad}
            alt={Locales.strings.scratchpad_alt}
        />
    )

    buildAnnotation = () => {
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

    buildProblemText = () => `$$${this.props.problem.text}$$`

    createNewSolution = (history) => {
        const { action, solutions, problem } = this.props;
        if (this.props.example) {
            history.push('/app/problem/example/');
        } else if (action !== 'new') {
            const currentSolution = solutions.find(
                solution => solution.problem.id === problem.id,
            );
            if (currentSolution && (currentSolution.editCode || currentSolution.shareCode)) {
                if (currentSolution.editCode && action !== 'review') {
                    history.push(`/app/problem/edit/${currentSolution.editCode}`);
                } else {
                    history.push(`/app/problem/view/${currentSolution.shareCode}`);
                }
            } else {
                const solution = {
                    problem: {
                        id: this.props.problem.id,
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
                        history.push(`/app/problem/edit/${response.data.editCode}`);
                    });
            }
        }
    }

    openNewProblemModal = () => {
        const { action } = this.props;
        if (action === 'new') {
            this.props.activateModals([ADD_PROBLEM_SET]);
        } else {
            this.props.activateModals([ADD_PROBLEMS]);
        }
    }

    render() {
        let annotation;
        let equation;
        let image;
        if (this.props.example) {
            annotation = Locales.strings.getting_started_title;
            equation = Locales.strings.getting_started_equation;
        } else if (this.props.addNew) {
            annotation = Locales.strings.add_problem_title;
        } else {
            annotation = this.buildAnnotation();
            equation = this.buildProblemText();
        }

        const wrappedAnnotation = annotation !== undefined && (annotation.match(/\\text{/g) || []).length > 1
            ? <span className={problemStyle.problemAnnotationScaled}>{annotation}</span>
            : <span className={problemStyle.problemAnnotation}>{annotation}</span>;

        const speechForMath = (this.props.problem && this.props.problem.text) ? (
            <span className="sROnly">
                {mathLive.latexToSpeakableText(
                    this.props.problem.text,
                    {
                        textToSpeechRules: 'sre',
                        textToSpeechRulesOptions: { domain: 'clearspeak', style: 'default', markup: 'none' },
                    },
                )}
            </span>
        ) : null;

        const imgButton = (this.props.problem && this.props.problem.scratchpad)
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problemStyle.imgIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onImgClick}
                    name="image"
                    tabIndex={0}
                />
            )
            : null;

        const plusButton = this.props.addNew
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problemStyle.plusIcon,
                            'fa-2x',
                        )
                    }
                    name="plus-circle"
                    tabIndex={0}
                />
            )
            : null;

        const editButton = this.props.showRemove
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problemStyle.editIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onEditClick}
                    name="edit"
                    tabIndex={0}
                />
            )
            : null;

        const removeButton = this.props.showRemove
            ? (
                <FontAwesome
                    className={
                        classNames(
                            problemStyle.trashIcon,
                            'fa-2x',
                        )
                    }
                    onClick={this.onTrashClick}
                    name="trash"
                    tabIndex={0}
                />
            )
            : null;

        const NavItem = withRouter(({ history }) => (
            <div
                id={`problem-${((this.props.number && this.props.number + 1) || 'new')}`}
                className={
                    classNames(
                        'd-flex',
                        'text-center',
                        problemStyle.problem,
                    )
                }
            >
                <button
                    type="button"
                    className={
                        classNames(
                            'btn',
                            buttons.default,
                            buttons.huge,
                            problemStyle.navSpan,
                            problemStyle.middle,
                            problemStyle.tile,
                            problemStyle.container,
                        )
                    }
                    onClick={() => (
                        this.props.addNew
                            ? this.openNewProblemModal()
                            : this.createNewSolution(history))}
                    onKeyPress={passEventForKeys(() => (
                        this.props.addNew
                            ? this.openNewProblemModal()
                            : this.createNewSolution(history)))}
                    tabIndex="0"
                    role="link"
                >
                    <div
                        className={
                            classNames(
                                problemStyle.navItemButton,
                                problemStyle.colorInherit,
                            )
                        }
                    >
                        {wrappedAnnotation}
                        <div
                            aria-hidden="true" // math speech is part of link
                            ref={(el) => { this.navItemContent = el; }}
                            className={classNames(
                                this.props.example ? null : problemStyle.equation,
                                this.state.isOverflownHorizontally
                                    ? problemStyle.equationOverflownHorizontally : null,
                                this.state.isOverflownVertically
                                    ? problemStyle.equationOverflownVertically : null,
                            )}
                        >
                            {equation}
                        </div>
                        {speechForMath}
                    </div>
                    <div className={problemStyle.btnContainer}>
                        {imgButton}
                        {editButton}
                        {removeButton}
                        {plusButton}
                    </div>
                    {this.props.problem && this.props.problem.scratchpad ? image : null}
                </button>
            </div>
        ));
        return <NavItem />;
    }
}
