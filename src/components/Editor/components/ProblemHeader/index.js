/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import classNames from 'classnames';
import Tour from 'reactour';
import { GlobalHotKeys } from 'react-hotkeys';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import { IntercomAPI } from 'react-intercom';
import Button from '../../../Button';
import problem from './styles.scss';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';
import showImage from '../../../../scripts/showImage';
import completeKeyMap from '../../../../constants/hotkeyConfig.json';
import { stopEvent, passEventForKeys } from '../../../../services/events';
import { tourConfig, accentColor } from './tourConfig';
// import parseMathLive from '../../../../scripts/parseMathLive';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemHeader extends Component {
    constructor(props) {
        super(props);

        this.onImgClick = this.onImgClick.bind(this);

        this.handlers = {
            SAVE_PROBLEM_SOLUTION: (e) => {
                if (this.props.isUpdated) {
                    this.props.saveProblem(e);
                }
                return stopEvent(e);
            },
        };
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

    onImgClick = () => {
        showImage(this.props.scratchpad);
        googleAnalytics('viewed problem image');
    }

    openTour = () => {
        this.props.openTour();
        googleAnalytics('Help Menu');
    }

    closeTour = () => {
        this.props.closeTour();
    }

    clickOnQuestion = () => {
        googleAnalytics('clicked help center');
        IntercomAPI('trackEvent', 'clicked-help-center');
    }

    clickedFeedback = () => {
        googleAnalytics('click feedback');
    }

    clickedHelpCenter = () => {
        googleAnalytics('click help center');
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

        const questionBtnId = 'navbarDropdownMenuLink-dropdown';

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
                        <span id={`${questionBtnId}-label`} className="sROnly">{Locales.strings.help_center}</span>
                        <button
                            className={`nav-link dropdown-toggle btn ${problem.dropDownMenu}`}
                            id={questionBtnId}
                            data-toggle="dropdown"
                            type="button"
                            tabIndex={0}
                            aria-labelledby={`${questionBtnId}-label`}
                            onClick={this.clickOnQuestion}
                            onKeyPress={passEventForKeys(this.clickOnQuestion)}
                        >
                            <FontAwesome
                                size="lg"
                                name="question"
                            />
                        </button>
                        <UncontrolledTooltip placement="top" target={questionBtnId} />
                        <div
                            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                            aria-labelledby={`${questionBtnId}-label`}
                        >
                            <button
                                className="dropdown-item reset-btn"
                                onClick={this.openTour}
                                onKeyPress={passEventForKeys(this.openTour)}
                                type="button"
                                tabIndex={0}
                            >
                                <FontAwesome
                                    className="super-crazy-colors"
                                    name="hand-o-up"
                                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                />
                                {Locales.strings.tutorial}
                            </button>
                            <a
                                className="dropdown-item"
                                href="https://intercom.help/benetech/en"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={this.clickedHelpCenter}
                                onKeyPress={passEventForKeys(this.clickedHelpCenter)}
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
                                onClick={this.clickedFeedback}
                                onKeyPress={passEventForKeys(this.clickedFeedback)}
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
                <GlobalHotKeys
                    keyMap={completeKeyMap}
                    handlers={this.handlers}
                    allowChanges
                />
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
                            content={(
                                <React.Fragment>
                                    <span className="sROnly">{Locales.strings.back_to_problem_page}</span>
                                    <span>{Locales.strings.all_problems}</span>
                                </React.Fragment>
                            )}
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
                <div className={`d-flex flex-row ${problem.subHeader}`} tabIndex={0}>
                    {imgButton}
                    <h1 id="ProblemTitle" className={problem.title}>
                        {title}
                        <span className="sROnly">
                            {mathLive.latexToSpeakableText(
                                this.props.math,
                                {
                                    textToSpeechRules: 'sre',
                                    textToSpeechRulesOptions: { domain: 'clearspeak', style: 'default', markup: 'none' },
                                },
                            )}
                        </span>
                    </h1>
                    <span id="ProblemMath" className={`${problem.title} ${problem.question}`}>{`$$${this.props.math}$$`}</span>
                </div>
            </React.Fragment>
        );
    }
}
