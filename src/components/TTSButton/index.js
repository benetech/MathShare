import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import Locales from '../../strings';
import uiActions from '../../redux/ui/actions';
import { stopEvent } from '../../services/events';

class TTSButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ttsState: null,
            text: props.text,
            audio: null,
        };
        this.polly = new window.AWS.Polly({ apiVersion: '2016-06-10' });
        this.ttsId = `${props.id}-${Math.round(Math.random() * 1000)}`;
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
        } else if (this.state.text !== newProps.text) {
            this.clearListeners();
            this.setState({
                tsState: null,
                text: newProps.text,
                audio: null,
            }, this.generateUrl);
        }
    }

    componentWillUnmount() {
        this.clearListeners();
    }

    endAudio = () => {
        this.setState({ ttsState: false });
        this.props.stopTtsPlaying(this.ttsId);
    }

    clearListeners = () => {
        const audio = this.state.audio;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.removeEventListener('ended', this.endAudio);
            this.endAudio();
            this.props.stopTtsPlaying(this.ttsId);
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
                audio.play();
                this.props.setTtsPlaying(this.ttsId);
            }
            return { ttsState: !prevState.ttsState };
        });
        return stopEvent(e);
    }

    generateUrl = () => {
        if (this.state.text === null) {
            return;
        }
        const speechParams = {
            OutputFormat: 'mp3',
            SampleRate: '16000',
            Text: this.state.text,
            TextType: 'text',
            VoiceId: 'Matthew',
        };
        const signer = new window.AWS.Polly.Presigner(speechParams, this.polly);
        signer.getSynthesizeSpeechUrl(speechParams, (error, url) => {
            if (!error) {
                const audio = new Audio(url);
                audio.load();
                this.setState({
                    ttsState: false,
                    audio,
                });
                audio.addEventListener('ended', this.endAudio);
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
                className={styles.ttsButton}
                id={this.props.id || this.ttsId}
                aria-label={this.getAriaLabel()}
                type="button"
                onClick={this.clickTtsBtn}
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
    }),
    uiActions,
)(TTSButton);
