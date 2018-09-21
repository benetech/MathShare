import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import editorArea from '../../styles.css';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';
import { alertInfo } from '../../../../../../../../scripts/alert';
import Locales from '../../../../../../../../strings';

import mic from '../../../../../../../../../images/mic.gif';
import micSlash from '../../../../../../../../../images/mic-slash.gif';
import micAnimate from '../../../../../../../../../images/mic-animate.gif';

function initializeRecognition(component) {
    // eslint-disable-next-line new-cap, no-undef
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = true;

    // eslint-disable-next-line func-names
    recognition.onresult = function (event) {
        const res = [];
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
            res.push(event.results[i][0].transcript);
        }
        const utterance = `${res}`;
        const currentAnnotation = component.props.textAreaValue;

        component.props.setTextAreaValue(`${currentAnnotation} ${utterance}`);

        $('#indicator-sr').text(utterance);
        // eslint-disable-next-line no-param-reassign
        component.spokens = component.spokens.concat(res);
    };

    return recognition;
}

export default class SpeechToTextButton extends Component {
    constructor(props) {
        super(props);

        let micImage = mic;
        try {
            this.recognition = initializeRecognition(this);
        } catch (e) {
            micImage = micSlash;
            // eslint-disable-next-line no-console
            console.log(Locales.strings.speech_recongition_error);
        }

        this.spokens = [];
        this.state = {
            micEnabled: false,
            imageSrc: micImage,
        };
    }

    speechToText() {
        googleAnalytics('S2T Clicked');
        if (!this.recognition) {
            alertInfo(Locales.strings.speech_recongition_error, 'Info');
            // eslint-disable-next-line no-console
            console.log(Locales.strings.speech_recongition_error);
            return;
        }
        if (this.state.micEnabled) {
            this.recognition.stop();
            this.setState({
                micEnabled: false,
                imageSrc: mic,
            });
        } else {
            this.recognition.start();
            this.setState({
                micEnabled: true,
                imageSrc: micAnimate,
            });
        }
    }

    render() {
        return (
            <span className={editorArea.floatRight}>
                <Button
                    id="start_button"
                    className={
                        classNames(
                            'btn',
                            'pointer',
                        )
                    }
                    additionalStyles={['mic']}
                    data-toggle="tooltip"
                    content={(
                        <img
                            id="mic_img"
                            alt={Locales.strings.start_speaking}
                            src={this.state.imageSrc}
                        />
                    )}
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onClick={this.speechToText.bind(this)}
                />
            </span>
        );
    }
}
