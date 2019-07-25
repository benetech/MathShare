/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import classNames from 'classnames';
import Tour from 'reactour';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import Button from '../../../Button';
import problem from './styles.scss';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';
import showImage from '../../../../scripts/showImage';
import { tourConfig, accentColor } from './tourConfig';
// import parseMathLive from '../../../../scripts/parseMathLive';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemHeader extends Component {
    constructor(props) {
        super(props);

        this.onImgClick = this.onImgClick.bind(this);
        this.openTour = this.openTour.bind(this);
        this.closeTour = this.closeTour.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        // this prevents unnecessary re-rendering and updates of the element
        return this.props.editLink !== nextProps.editLink || this.props.title !== nextProps.title
            || this.props.math !== nextProps.math || this.props.tourOpen !== nextProps.tourOpen
            || this.props.isUpdated !== nextProps.isUpdated
            || this.props.lastSaved !== nextProps.lastSaved;
    }

    componentDidUpdate() {
        mathLive.renderMathInDocument();
    }

    onImgClick() {
        showImage(this.props.scratchpad);
        googleAnalytics('viewed problem image');
    }

    openTour() {
        this.props.openTour();
        googleAnalytics('Help Menu');
    }

    closeTour() {
        this.props.closeTour();
    }

    render() {
        const imgButton = this.props.scratchpad
            ? (
                <Button
                    id="scratchpadBtn"
                    className={classNames('btn', 'pointer', problem.button, problem.imageBtn)}
                    additionalStyles={['image']}
                    ariaHidden="true"
                    type="button"
                    icon="image"
                    onClick={this.onImgClick}
                />
            )
            : null;

        const title = `${this.props.title}: `;

        const editOnlyControls = this.props.readOnly ? null
            : (
                <div className={`d-flex justify-content-end flex-shrink-1 ${problem.btnContainer}`}>
                    {/* <Button
                        id="shareBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        type="button"
                        icon="share-alt"
                        content={Locales.strings.share}
                        onClick={this.props.shareProblem}
                    /> */}
                    <Button
                        id="saveBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        type="button"
                        icon="save"
                        content={Locales.strings.save}
                        onClick={this.props.saveProblem}
                        disabled={!this.props.isUpdated}
                    />
                    {this.props.lastSaved && (
                        <div className={problem.timeContainer}>
                            <div>Saved</div>
                            <div>{this.props.lastSaved}</div>
                        </div>
                    )}
                    <li className="nav-item dropdown">
                        <button
                            className={`nav-link dropdown-toggle btn ${problem.dropDownMenu}`}
                            id="navbarDropdownMenuLink-dropdown"
                            data-toggle="dropdown"
                            type="button"
                            tabIndex={0}
                        >
                            <FontAwesome
                                size="lg"
                                name="question"
                            />
                        </button>
                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-dropdown" />
                        <div
                            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                            aria-labelledby="navbarDropdownMenuLink-dropdown"
                        >
                            <a
                                className="dropdown-item"
                                onClick={this.openTour}
                                onKeyPress={this.openTour}
                                role="button"
                                tabIndex={0}
                            >
                                <FontAwesome
                                    className="super-crazy-colors"
                                    name="hand-o-up"
                                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                />
                                {Locales.strings.tutorial}
                            </a>
                            <a
                                className="dropdown-item"
                                href="https://intercom.help/benetech/en"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    googleAnalytics('click help center');
                                }}
                            >
                                <FontAwesome
                                    className="super-crazy-colors"
                                    name="comment"
                                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                />
                                {Locales.strings.help_center}
                            </a>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLScSZJo47vQM_5ci2MOgBbJW7WM6FbEi2xABR5qSZd8oD2RZEg/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dropdown-item"
                                onClick={() => {
                                    googleAnalytics('click feedback');
                                }}
                            >
                                <FontAwesome
                                    className="super-crazy-colors"
                                    name="arrow-circle-right"
                                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                />
                                {Locales.strings.provide_feedback}
                            </a>
                        </div>
                    </li>
                </div>
            );

        const exampleLabel = this.props.example
            ? <span className={problem.label}>{Locales.strings.example}</span> : null;

        return (
            <React.Fragment>
                <div className={`d-flex flex-row ${problem.header}`}>
                    <div className={problem.backBtnContainer}>
                        <Button
                            id="backBtn"
                            className={classNames('btn', 'pointer', problem.button)}
                            additionalStyles={['default']}
                            type="button"
                            icon="arrow-left"
                            onClick={this.props.goBack}
                            tabIndex="-1"
                            ariaLabel={Locales.strings.back_to_problem_page}
                            content={<span className="sROnly">{Locales.strings.back_to_problem_page}</span>}
                        />
                    </div>
                    <span id="math-ellipsis" className={`flex-grow-1 ${problem.mathEllipsis}`}>&nbsp;</span>
                    {exampleLabel}
                    {editOnlyControls}
                    <Tour
                        onRequestClose={this.closeTour}
                        steps={tourConfig}
                        isOpen={this.props.tourOpen}
                        rounded={5}
                        accentColor={accentColor}
                        startAt={0}
                        lastStepNextButton={
                            <div className={classNames('btn', 'pointer', problem.btnFinish)}>{Locales.strings.finish}</div>
                        }
                    />
                </div>
                <div className={`d-flex flex-row ${problem.subHeader}`}>
                    {imgButton}
                    <h1 id="ProblemTitle" className={problem.title}>{title}</h1>
                    <span id="ProblemMath" className={`${problem.title} ${problem.question}`}>{`$$${this.props.math}$$`}</span>
                </div>
            </React.Fragment>
        );
    }
}
