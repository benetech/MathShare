import React, { Component } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import { isNumber } from 'util';
import {
    EDIT_PROBLEM, CONFIRMATION, ADD_PROBLEMS, ADD_PROBLEM_SET,
} from '../../../../ModalContainer';
import problemStyle from './styles.scss';
import buttons from '../../../../Button/styles.scss';
import Locales from '../../../../../strings';
import showImage from '../../../../../scripts/showImage';
import parseMathLive from '../../../../../scripts/parseMathLive';
import { stopEvent, passEventForKeys } from '../../../../../services/events';
import CommonDropdown from '../../../../CommonDropdown';
import { getMathshareLink } from '../../../../../services/mathshare';
import { latexToSpeakableText } from '../../../../../lib/mathlivedist/mathlive';

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
        this.props.setEditProblem(this.props.number, this.props.action, this.props.problem.title);
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

    getLink = () => {
        const {
            solutions, problem, action, code, position,
        } = this.props;
        if (this.props.example) {
            return '/#/app/problem/example/';
        }
        if (solutions && problem) {
            const currentSolution = solutions.find(
                solution => solution.problem.id === problem.id,
            );
            return `/#${getMathshareLink({ action, code, position }, currentSolution, problem)}`;
        }
        return null;
    }

    openNewProblemModal = (e) => {
        const { action } = this.props;
        if (action === 'new') {
            this.props.activateModals([ADD_PROBLEM_SET]);
        } else {
            this.props.activateModals([ADD_PROBLEMS]);
        }
        return stopEvent(e);
    }

    renderButtons = () => {
        const dropdownId = `problem-dropdown-${this.props.number}`;
        const imgButton = (this.props.problem && this.props.problem.scratchpad)
            ? (
                <button
                    className="reset-btn"
                    onClick={this.onImgClick}
                    onKeyPress={passEventForKeys(this.onImgClick)}
                    type="button"
                    key={`${dropdownId}-imgBtn`}
                >
                    <span className="sROnly">
                        {Locales.strings.view_sketch.replace('{no}', this.props.number + 1)}
                        {'\u00A0'}
                        {Locales.strings.opens_in_new_tab}
                    </span>
                    <FontAwesome
                        className={
                            classNames(
                                problemStyle.imgIcon,
                                'fa-2x',
                            )
                        }
                        name="image"
                    />
                </button>
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
                    key={`${dropdownId}-plusBtn`}
                />
            )
            : null;

        const editButton = this.props.showRemove
            ? (
                <button
                    className="reset-btn"
                    onClick={this.onEditClick}
                    onKeyPress={passEventForKeys(this.onEditClick)}
                    type="button"
                    key={`${dropdownId}-editBtn`}
                >
                    <FontAwesome
                        className={
                            classNames(
                                problemStyle.editIcon,
                                'fa-2x',
                            )
                        }
                        name="edit"
                    />
                    <span className={problemStyle.text}>{Locales.strings.edit_problem}</span>
                </button>

            )
            : null;

        const removeButton = this.props.showRemove
            ? (
                <button
                    className="reset-btn"
                    onClick={this.onTrashClick}
                    onKeyPress={passEventForKeys(this.onTrashClick)}
                    type="button"
                    key={`${dropdownId}-removeBtn`}
                >
                    <FontAwesome
                        className={
                            classNames(
                                problemStyle.trashIcon,
                                'fa-2x',
                            )
                        }
                        name="trash"
                    />
                    <span className={problemStyle.text}>{Locales.strings.remove_problem}</span>
                </button>
            )
            : null;
        const buttonsList = [editButton, removeButton].filter(button => button);
        return (
            <span className={problemStyle.btnContainer}>
                {imgButton}
                {plusButton}
                {buttonsList.length > 0
                    && (
                        <>
                            <CommonDropdown
                                btnId={dropdownId}
                                btnClass="reset-btn"
                                btnContent={(
                                    <span className="sROnly">
                                        {Locales.strings.more_options_for.replace('{title}', this.props.problem.title)}
                                    </span>
                                )}
                                btnIcon="ellipsis-v"
                                listClass="dropdown-menu-lg-right dropdown-secondary"
                            >
                                {buttonsList}
                            </CommonDropdown>
                            <UncontrolledTooltip placement="top" target={dropdownId} />
                        </>
                    )
                }
            </span>
        );
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
                {latexToSpeakableText(this.props.problem.text)}
            </span>
        ) : null;

        const NavItem = withRouter(() => {
            const NavTag = this.props.solutions ? 'a' : 'button';
            const additionalProps = {};
            if (NavTag === 'a') {
                additionalProps.href = this.getLink();
            } else {
                additionalProps.onClick = (e) => {
                    if (this.props.addNew) {
                        this.openNewProblemModal(e);
                    }
                };
                additionalProps.onKeyPress = passEventForKeys(additionalProps.onClick);
            }
            return (
                <div
                    id={`problem-${((isNumber(this.props.number) && this.props.number + 1) || 'new')}`}
                    className={
                        classNames(
                            'd-flex',
                            'text-center',
                            problemStyle.problem,
                        )
                    }
                >
                    <NavTag
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
                        {...additionalProps}
                    >
                        <span
                            className={
                                classNames(
                                    problemStyle.navItemButton,
                                    problemStyle.colorInherit,
                                )
                            }
                        >
                            {wrappedAnnotation}
                            <span
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
                            </span>
                            {speechForMath}
                        </span>
                        {this.props.problem && this.props.problem.scratchpad ? image : null}
                    </NavTag>
                    {this.renderButtons()}
                </div>
            );
        });
        return <NavItem />;
    }
}
