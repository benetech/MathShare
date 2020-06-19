import React, { Component } from 'react';
import { connect } from 'react-redux';
import lodash from 'lodash';
import { UncontrolledTooltip } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import Locales from '../../strings';
import uiActions from '../../redux/ui/actions';
import ariaLiveActions from '../../redux/ariaLiveAnnouncer/actions';
import { stopEvent } from '../../services/events';
import { alertError } from '../../scripts/alert';

class TTSButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ttsState: null,
            text: this.getText(props.text),
            audio: null,
            ttsConfig: null,
        };
        if (props.userProfile.config) {
            this.state.ttsConfig = props.userProfile.config.tts || {
                speed: 1.0,
            };
        }
        this.polly = new window.AWS.Polly({ apiVersion: '2016-06-10' });
        this.ttsId = `${props.id}-${Math.round(Math.random() * 1000)}`;
        this.debouncedClick = lodash.debounce(this.clickTtsBtn, 250, {
            leading: true,
            trailing: true,
        });
    }

    componentDidMount() {
        this.generateUrl();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.ui.ttsId !== this.ttsId) {
            if (this.state.ttsState) {
                const audio = this.state.audio;
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    this.setState({ ttsState: false });
                }
            }
        } else if (this.state.text !== this.getText(newProps.text)
        || (
            newProps.userProfile.config
            && this.compareTtsConfig(newProps)
        )) {
            this.clearListeners(true);
            this.setState({
                tsState: null,
                text: this.getText(newProps.text),
                audio: null,
                ttsConfig: (newProps.userProfile.config || {}).tts || {},
            }, () => {
                this.generateUrl(true, 0);
            });
        }
    }

    componentWillUnmount() {
        this.clearListeners();
    }

    compareTtsConfig = newProps => (
        JSON.stringify(newProps.userProfile.config.tts) !== JSON.stringify(this.state.ttsConfig)
    )

    getText = (inputText) => {
        if (typeof inputText === 'function') {
            return inputText();
        }
        return inputText;
    }

    playAudio = (retryNo) => {
        const { audio } = this.state;
        audio.play()
            .then(() => {
                this.props.setTtsPlaying(this.ttsId);
            })
            .catch(() => {
                if (retryNo < 1) {
                    this.generateUrl(true, retryNo + 1);
                } else {
                    alertError(Locales.strings.tts_error, Locales.strings.error);
                    this.props.clearAriaLive();
                    this.props.announceOnAriaLive(Locales.strings.tts_error);
                    this.endAudio();
                }
            });
    }

    endAudio = () => {
        this.setState({ ttsState: false });
        this.props.stopTtsPlaying(this.ttsId);
    }

    clearListeners = (dontStop) => {
        const audio = this.state.audio;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.removeEventListener('ended', this.endAudio);
            if (!dontStop) {
                this.endAudio();
                this.props.stopTtsPlaying(this.ttsId);
            }
        }
    }

    clickTtsBtn = (e) => {
        this.setState((prevState) => {
            const audio = prevState.audio;
            if (prevState.ttsState) {
                audio.pause();
                audio.currentTime = 0;
                this.props.stopTtsPlaying(this.ttsId);
            } else {
                this.playAudio(0);
            }
            return { ttsState: !prevState.ttsState };
        });
        return stopEvent(e);
    }

    getSsml = () => {
        const text = this.state.text;
        const { ttsConfig } = this.state;
        let speed = 100;
        if (ttsConfig && ttsConfig.speed > 0) {
            speed *= ttsConfig.speed;
        }
        return `<speak><prosody rate="${Math.round(speed)}%">${text}</prosody></speak>`;
    }

    generateUrl = (playOnGeneration, retryNo) => {
        if (this.state.text === null) {
            return;
        }
        const speechParams = {
            OutputFormat: 'mp3',
            SampleRate: '16000',
            Text: this.getSsml(),
            TextType: 'ssml',
            VoiceId: 'Matthew',
        };
        const signer = new window.AWS.Polly.Presigner(speechParams, this.polly);
        signer.getSynthesizeSpeechUrl(speechParams, (error, url) => {
            if (!error) {
                const audio = new Audio(url);
                audio.load();
                audio.addEventListener('ended', this.endAudio);
                this.setState({
                    ttsState: playOnGeneration,
                    audio,
                }, () => {
                    if (playOnGeneration) {
                        this.playAudio(retryNo || 0);
                    }
                });
            }
        });
    }

    getAriaLabel = () => {
        const { ttsState } = this.state;
        let prefix = '';
        if (ttsState) {
            prefix = Locales.strings.stop_speaking;
        } else {
            prefix = Locales.strings.speak;
        }
        return `${prefix}${this.props.ariaLabelSuffix}`;
    }

    render() {
        const { ttsState } = this.state;
        if (ttsState === null) {
            return null;
        }
        const tooltip = (
            <UncontrolledTooltip placement="top" target={this.props.id || this.ttsId}>
                {this.props.title}
            </UncontrolledTooltip>
        );

        const iconName = (ttsState ? 'stop-circle' : 'volume-up');

        const button = (
            <button
                className={`${styles.ttsButton} ${this.props.additionalClass}`}
                id={this.props.id || this.ttsId}
                aria-label={this.getAriaLabel()}
                type="button"
                onClick={this.debouncedClick}
            >
                <FontAwesome name={iconName} size="lg" />
            </button>

        );

        return (
            <span className={this.props.spanStyle || ''}>
                {button}
                {tooltip}
            </span>
        );
    }
}


export default connect(
    state => ({
        ui: state.ui,
        userProfile: state.userProfile,
    }),
    {
        ...uiActions,
        ...ariaLiveActions,
    },
)(TTSButton);
