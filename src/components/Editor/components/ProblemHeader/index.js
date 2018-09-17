import React, { Component } from "react";
import Button from '../../../../components/Button';
import classNames from "classnames";
import problem from './styles.css';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import Locales from '../../../../strings';
import showImage from '../../../../scripts/showImage';
import parseMathLive from '../../../../scripts/parseMathLive.js';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../../src/lib/mathlivedist/mathlive.js');

export default class ProblemHeader extends Component {    
    constructor(props) {
        super(props);

        this.onImgClick = this.onImgClick.bind(this);
    }
    
    shouldComponentUpdate(nextProps) { //this prevents unnecessary re-rendering and updates of the element
        return this.props.editLink !== nextProps.editLink || this.props.title !== nextProps.title 
            || this.props.math !== nextProps.math;    
    }
    
    componentDidUpdate() {
        mathLive.renderMathInDocument();
    }
    
    tour() {
        introJs().setOption('tooltipClass', 'introjs-helperLayer').start();
        googleAnalytics('Tour');
    }

    onImgClick() {
        showImage(this.props.scratchpad);
    }

    render() {
        var imgButton = this.props.scratchpad ?
        <Button
            className={classNames('btn', 'pointer', problem.button)}
            additionalStyles={['image']}
            ariaHidden="true"
            type="button"
            icon="image"
            iconSize="2x"
            onClick={this.onImgClick}
        />
        : null;

        var text = parseMathLive(this.props.title);
        const title =  "$$" + text + ": }$$";
        
        var editOnlyControls = this.props.readOnly ? null :
        <div className={problem.btnContainer}>
                    <span className={problem.editLinkLabel}>{Locales.strings.edit_link_label}</span>
                    <input type="text" readOnly value={this.props.editLink} className={problem.editLink}/>
            <Button
                className={classNames('btn', 'pointer', problem.button)}
                additionalStyles={['default']}
                type="button"
                icon="share-alt"
                content={Locales.strings.share}
                onClick={this.props.shareProblem} />
            <Button
                className={classNames('btn', 'pointer', problem.button)}
                additionalStyles={['default']}
                type="button"
                icon="save"
                content={Locales.strings.save}
                onClick={this.props.saveProblem} />
            <Button
                className={classNames('btn', 'pointer', problem.button)}
                additionalStyles={['default']}
                ariaHidden="true"
                type="button"
                icon="question"
                onClick={this.tour} />
        </div>

        const exampleLabel = this.props.example ? <span className={problem.label}>{Locales.strings.example}</span> : null;

        return (
            <div className={problem.header}>
                <div className={problem.backBtnContainer}>
                    <Button
                        id="backBtn"
                        className={classNames('btn', 'pointer', problem.button)}
                        additionalStyles={['default']}
                        ariaHidden="true"
                        type="button"
                        icon="arrow-left"
                        onClick={this.props.goBack} />
                </div>
                <span id="ProblemTitle" className={problem.title} role="heading" aria-level="1">{title}</span>
                <span id="ProblemMath" className={problem.title}>{"$$" + this.props.math + "$$"}</span>
                {exampleLabel}
                {imgButton}
                {editOnlyControls}
            </div>
        );
    }
}
