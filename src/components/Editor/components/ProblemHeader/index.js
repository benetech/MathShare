import React, { Component } from 'react';
import classNames from 'classnames';
import Tour from 'reactour';
import Button from '../../../Button';
import problem from './styles.css';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';
import showImage from '../../../../scripts/showImage';
import { tourConfig, accentColor } from './tourConfig';
import parseMathLive from '../../../../scripts/parseMathLive';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTourOpen: false,
        };

        this.onImgClick = this.onImgClick.bind(this);
        this.openTour = this.openTour.bind(this);
        this.closeTour = this.closeTour.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // this prevents unnecessary re-rendering and updates of the element
        return this.props.editLink !== nextProps.editLink || this.props.title !== nextProps.title
            || this.props.math !== nextProps.math || this.state.isTourOpen !== nextState.isTourOpen;
    }

    componentDidUpdate() {
        mathLive.renderMathInDocument();
    }

    onImgClick() {
        showImage(this.props.scratchpad);
    }

    openTour() {
        this.setState({ isTourOpen: true });
        googleAnalytics('Tour');
    }

    closeTour() {
        this.setState({ isTourOpen: false });
    }

    render() {
        const imgButton = this.props.scratchpad
            ? (
                <Button
                    id="scratchpadBtn"
                    className={classNames('btn', 'pointer', problem.button)}
                    additionalStyles={['image']}
                    ariaHidden="true"
                    type="button"
                    icon="image"
                    iconSize="2x"
                    onClick={this.onImgClick}
                />
            )
            : null;

        const text = parseMathLive(this.props.title);
        const title = `$$${text}: }$$`;

        const editOnlyControls = this.props.readOnly ? null
            : (
                <div className={problem.btnContainer}>
                    <span className={problem.editLinkLabel}>{Locales.strings.edit_link_label}</span>
                    <input id="editUrl" type="text" readOnly value={this.props.editLink} className={problem.editLink} />
                    <Button
                        id="shareBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        type="button"
                        icon="share-alt"
                        content={Locales.strings.share}
                        onClick={this.props.shareProblem}
                    />
                    <Button
                        id="saveBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        type="button"
                        icon="save"
                        content={Locales.strings.save}
                        onClick={this.props.saveProblem}
                    />
                    <Button
                        id="questionBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        ariaHidden="true"
                        type="button"
                        icon="question"
                        onClick={this.openTour}
                    />
                </div>
            );

        const exampleLabel = this.props.example
            ? <span className={problem.label}>{Locales.strings.example}</span> : null;

        return (
            <div className={problem.header}>
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
                <h1 id="ProblemTitle" className={problem.title}>{title}</h1>
                <span id="ProblemMath" className={problem.title}>{`$$${this.props.math}$$`}</span>
                {exampleLabel}
                {imgButton}
                {editOnlyControls}
                <Tour
                    onRequestClose={this.closeTour}
                    steps={tourConfig}
                    isOpen={this.state.isTourOpen}
                    rounded={5}
                    accentColor={accentColor}
                    startAt={0}
                    lastStepNextButton={
                        <div className={classNames('btn', 'pointer', problem.btnFinish)}>{Locales.strings.finish}</div>
                    }
                />
            </div>
        );
    }
}
