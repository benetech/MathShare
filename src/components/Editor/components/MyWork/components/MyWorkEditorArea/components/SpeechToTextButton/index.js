import React, { Component } from "react";
import Button from '../../.././../../../../Button';
import classNames from "classnames";
import editorArea from '../../styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../../../../styles.css';
import {NotificationManager} from 'react-notifications';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';

const SPEECH_RECOGNITION_ERROR = "Speech recognition is supported only for Google Chrome";

export default class SpeechToTextButton extends Component {
    constructor(props) {
        super(props);

        var micImage = "src/images/mic.gif";
        try {
            this.recognition = initializeRecognition(this);
        } catch (e) {
            micImage = "src/images/mic-slash.gif"
            console.log(SPEECH_RECOGNITION_ERROR);
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
            NotificationManager.info(SPEECH_RECOGNITION_ERROR, 'Info');
            console.log(SPEECH_RECOGNITION_ERROR);
            return;
        }
        if (this.state.micEnabled) {
            this.recognition.stop();
            this.setState({
                micEnabled: false,
                imageSrc: "src/images/mic.gif"
            });
        } else {
            this.recognition.start();
            this.setState({
                micEnabled: true,
                imageSrc: "src/images/mic-animate.gif"
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
                            bootstrap.btn,
                            styles.pointer
                        )
                    }
                    additionalStyles={['mic']}
                    data-toggle="tooltip"
                    content={
                        <img
                            id="mic_img"
                            alt="Start Speaking"
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
