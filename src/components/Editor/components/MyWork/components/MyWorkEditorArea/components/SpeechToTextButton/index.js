import React, { Component } from "react";
import Button from '../../.././../../../../Button';
import classNames from "classnames";
import editorArea from '../../styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../../../../styles.css';

export default class SpeechToTextButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            micEnabled: false,
            imageSrc: "src/images/mic.gif"
        }
        this.spokens = [];
        this.recognition = initializeRecognition(this);
    }

    speechToText() {
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
                //TODO onclick="GoogleAnalytics('S2T Clicked');"
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
