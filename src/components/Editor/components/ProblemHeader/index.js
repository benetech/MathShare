import React, { Component } from 'react';
import classNames from 'classnames';
import Tour from 'reactour';
import { GlobalHotKeys } from 'react-hotkeys';
import Button from '../../../Button';
import problem from './styles.scss';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';
import showImage from '../../../../scripts/showImage';
import completeKeyMap from '../../../../constants/hotkeyConfig.json';
import { stopEvent } from '../../../../services/events';
import { tourConfig, accentColor } from './tourConfig';
import TTSButton from '../../../TTSButton';
import { latexToSpeakableText } from '../../../../services/speech';
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

    componentDidMount() {
        // const subHeader = document.getElementById('subHeader');
        // if (subHeader) {
        //     subHeader.focus();
        // }
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

    getSpeakableText = () => `${this.props.title} ${latexToSpeakableText(this.props.math)}`;

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
                </div>
            );

        const exampleLabel = this.props.example
            ? <span className={problem.label}>{Locales.strings.example}</span> : null;

        const ttsButton = (
            <TTSButton
                id="tts-prompt"
                additionalClass={classNames('btn', problem.ttsButton)}
                text={this.getSpeakableText()}
                spanStyle="flex-grow-1"
                ariaLabelSuffix={Locales.strings.prompt}
            />
        );

        return (
            <React.Fragment>
                <GlobalHotKeys
                    keyMap={completeKeyMap}
                    handlers={this.handlers}
                    allowChanges
                />
                <div className={`d-flex flex-row ${problem.header}`}>
                    <div id="mainContainer" className={`d-flex flex-row ${problem.subHeader}`}>
                        {imgButton}
                        <h1 id="ProblemTitle" className={problem.title} tabIndex={-1}>
                            {title}
                            <span className="sROnly">
                                {latexToSpeakableText(this.props.math)}
                            </span>
                        </h1>
                        {this.props.math !== Locales.strings.loading && (<span id="ProblemMath" className={`${problem.title} ${problem.question}`}>{`$$${this.props.math}$$`}</span>)}
                        <span id="math-ellipsis" className={problem.mathEllipsis}>&nbsp;</span>
                        {ttsButton}
                        {exampleLabel}
                        <Button
                            id="backBtn"
                            className={classNames('btn', 'pointer', problem.button)}
                            additionalStyles={['default']}
                            type="button"
                            icon="arrow-left"
                            onClick={this.props.goBack()}
                            ariaLabel={Locales.strings.back_to_problem_page}
                            content={(
                                <React.Fragment>
                                    <span className="sROnly">{Locales.strings.back_to_problem_page}</span>
                                    <span>{Locales.strings.all_problems}</span>
                                </React.Fragment>
                            )}
                        />
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
                </div>
            </React.Fragment>
        );
    }
}
