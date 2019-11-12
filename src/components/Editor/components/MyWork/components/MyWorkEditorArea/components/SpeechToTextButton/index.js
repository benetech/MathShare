import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Watson from 'watson-speech';
import { GlobalHotKeys } from 'react-hotkeys';
import { IntercomAPI } from 'react-intercom';
import { SERVER_URL } from '../../../../../../../../config';
import Button from '../../../../../../../Button';
import editorArea from '../../styles.scss';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';
import { alertInfo, alertWarning, alertError } from '../../../../../../../../scripts/alert';
import { stopEvent } from '../../../../../../../../services/events';
import Locales from '../../../../../../../../strings';
import { announceOnAriaLive } from '../../../../../../../../redux/ariaLiveAnnouncer/actions';
import completeKeyMap from '../../../../../../../../constants/hotkeyConfig.json';

import mic from '../../../../../../../../../images/mic.gif';
import micSlash from '../../../../../../../../../images/mic-slash.gif';
import micAnimate from '../../../../../../../../../images/mic-animate.gif';
import styles from './styles.scss';

function initializeRecognitionChrome(component) {
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

function initializeRecognitionOther(component, callback) {
    return fetch(`${SERVER_URL}/solution/s2t/token`)
        .then(response => response.json())
        .then((response) => {
            const stream = Watson.SpeechToText.recognizeMicrophone({ // eslint-disable-line
                access_token: response.access_token,
                object_mode: false,
                interim_results: true,
            });
            stream.setEncoding('utf8');
            stream.on('error', (err) => {
                callback(err);
            });
            stream.on('data', (data) => {
                const processedData = ('' || data).replace(/\. $/, ' ').toLowerCase();
                const currentAnnotation = component.props.textAreaValue;

                component.props.setTextAreaValue(`${currentAnnotation} ${processedData}`);

                $('#indicator-sr').text(processedData);
                // eslint-disable-next-line no-param-reassign
                component.spokens = component.spokens.concat(processedData);
            });
            // eslint-disable-next-line no-param-reassign
            component.recognition = stream;
            return stream;
        });
}

class SpeechToTextButton extends Component {
    constructor(props) {
        super(props);
        const isChrome = (/Chrome/.test(navigator.userAgent)
            && /Google Inc/.test(navigator.vendor));
        this.spokens = [];

        let imageSrc = mic;

        if (isChrome) {
            try {
                this.recognition = initializeRecognitionChrome(this);
            } catch (error) {
                imageSrc = micSlash;
            }
        }

        this.state = {
            isChrome,
            imageSrc,
            micEnabled: false,
            inProgress: false,
        };
        this.handlers = {
            TRIGGER_S2T: (e) => {
                this.speechToText();
                return stopEvent(e);
            },
        };
    }

    speechToText = () => {
        const {
            isChrome,
            micEnabled,
        } = this.state;
        googleAnalytics('Speech to Text');
        IntercomAPI('trackEvent', 'stt-button');

        if (isChrome) {
            if (!this.recognition) {
                alertInfo(Locales.strings.speech_recongition_error, 'Info');
            } else if (micEnabled) {
                this.setState({
                    micEnabled: false,
                    imageSrc: mic,
                }, () => {
                    this.props.announceOnAriaLive(Locales.strings.dictatation_complete);
                    this.recognition.stop();
                });
            } else {
                this.setState({
                    micEnabled: true,
                    imageSrc: micAnimate,
                }, () => {
                    try {
                        this.recognition.start();
                        this.props.announceOnAriaLive(Locales.strings.dictatation_started);
                    } catch (error) {
                        this.setState({
                            micEnabled: false,
                            imageSrc: mic,
                        });
                        alertInfo(Locales.strings.speech_recongition_error, Locales.strings.error);
                    }
                });
            }
        } else if (micEnabled) {
            this.props.announceOnAriaLive(Locales.strings.dictatation_complete);
            if (this.recognition) {
                this.recognition.stop();
                this.recognition = null;
            }
            this.setState({
                micEnabled: false,
                imageSrc: mic,
            });
        } else {
            if (this.state.inProgress) {
                return;
            }
            this.setState({
                imageSrc: micSlash,
                inProgress: true,
            }, () => {
                try {
                    initializeRecognitionOther(this, (err) => {
                        if (err && err.name === 'NotAllowedError') {
                            alertWarning(Locales.strings.speech_recongition_permission_denied, 'Permission Denied!');
                        } else {
                            alertError(Locales.strings.speech_recongition_error, 'Error');
                        }
                        this.setState({
                            micEnabled: false,
                            imageSrc: mic,
                            inProgress: false,
                        });
                    })
                        .then(() => {
                            this.setState({
                                micEnabled: true,
                                imageSrc: micAnimate,
                                inProgress: false,
                            }, () => {
                                this.props.announceOnAriaLive(Locales.strings.dictatation_started);
                            });
                        });
                } catch (e) {
                    alertInfo(Locales.strings.speech_recongition_error, 'Info');
                }
            });
        }
    }

    render() {
        return (
            <span className={editorArea.floatRight}>
                <GlobalHotKeys
                    keyMap={completeKeyMap}
                    handlers={this.handlers}
                    allowChanges
                />
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
                        <>
                            <img
                                id="mic_img"
                                alt=""
                                src={this.state.imageSrc}
                            />
                            <span className={styles.ttsLabel}>
                                {this.state.micEnabled
                                    ? Locales.strings.stop_dictation : Locales.strings.dictate
                                }
                            </span>
                        </>
                    )}
                    onClick={this.speechToText}
                />
            </span>
        );
    }
}

export default connect(
    () => ({}),
    {
        announceOnAriaLive,
    },
)(SpeechToTextButton);
