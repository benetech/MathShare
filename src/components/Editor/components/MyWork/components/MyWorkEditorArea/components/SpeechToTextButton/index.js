import React, { Component } from "react";
import Button from '../../.././../../../../Button';
import classNames from "classnames";
import editorArea from '../../styles.css';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';
import createAlert from '../../../../../../../../scripts/alert';
import Locales from '../../../../../../../../strings'

export default class SpeechToTextButton extends Component {
    constructor(props) {
        super(props);

        var micImage = "/src/images/mic.gif";
        try {
            this.recognition = initializeRecognition(this);
        } catch (e) {
            micImage = "/src/images/mic-slash.gif"
            console.log(Locales.strings.speech_recongition_error);
        }

        this.spokens = [];
        this.state = {
            micEnabled: false,
            imageSrc: micImage
        }
    }

    speechToText() {
        googleAnalytics('S2T Clicked');
        if (!this.recognition) {
            createAlert('info', Locales.strings.speech_recongition_error, 'Info');
            console.log(Locales.strings.speech_recongition_error);
            return;
        }
        if (this.state.micEnabled) {
            this.recognition.stop();
            this.setState({
                micEnabled: false,
                imageSrc: "/src/images/mic.gif"
            });
        } else {
            this.recognition.start();
            this.setState({
                micEnabled: true,
                imageSrc: "/src/images/mic-animate.gif"
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
                            'pointer'
                        )
                    }
                    additionalStyles={['mic']}
                    data-toggle="tooltip"
                    content={
                        <img
                            id="mic_img"
                            alt={Locales.strings.start_speaking}
                            src={this.state.imageSrc}
                        />
                    }
                    onClick={this.speechToText.bind(this)}
                />
            </span>
        );
    }
}

function initializeRecognition(component) {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = function(event) {
        var res = [];
        for(var i= event.resultIndex; i<event.results.length; i++)
            res.push(event.results[i][0].transcript);
        var utterance = res+"";
        let currentAnnotation = component.props.textAreaValue;

        component.props.setTextAreaValue(currentAnnotation +' '+ utterance);

        $("#indicator-sr").text(utterance);
        component.spokens = component.spokens.concat(res);
    };

    return recognition;
}
