import React, { Component } from 'react';
import { connect } from 'react-redux';
import lodash from 'lodash';
import { UncontrolledTooltip } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import Locales from '../../strings';
import uiActions from '../../redux/ui/actions';
import ariaLiveActions from '../../redux/ariaLiveAnnouncer/actions';
import ttsActions from '../../redux/tts/actions';
import { initializePollyClient } from '../../services/aws';

class TTSButton extends Component {
    constructor(props) {
        super(props);
        this.polly = new window.AWS.Polly({ apiVersion: '2016-06-10' });
        this.ttsId = `${props.id}-${Math.round(Math.random() * 1000)}`;
        this.debouncedClick = lodash.debounce(this.clickTtsBtn, 250, {
            leading: true,
            trailing: true,
        });
        this.props.loadTtsAudio(this.ttsId, this.getText(props.text));
        initializePollyClient();
    }

    componentWillUnmount() {
        this.props.dismountTtsButton(this.ttsId);
    }

    getText = (inputText) => {
        if (typeof inputText === 'function') {
            return inputText();
        }
        return inputText;
    }

    clickTtsBtn = () => {
        const { currentTtsId } = this.props.tts;
        if (currentTtsId === this.ttsId) {
            this.props.stopTtsAudio(this.ttsId);
        } else {
            this.props.startTts(this.ttsId, this.getText(this.props.text));
        }
    }

    getAriaLabel = () => {
        const { currentTtsId, currentTtsStatus } = this.props.tts;
        let prefix = '';
        if (currentTtsId === this.ttsId) {
            if (currentTtsStatus) {
                prefix = Locales.strings.stop_speaking;
            } else {
                prefix = Locales.strings.loading_2;
            }
        } else {
            prefix = Locales.strings.speak;
        }
        return `${prefix}${this.props.ariaLabelSuffix}`;
    }

    render() {
        const { currentTtsId, currentTtsStatus } = this.props.tts;
        const tooltip = (
            <UncontrolledTooltip placement="top" target={this.props.id || this.ttsId}>
                {this.props.title}
            </UncontrolledTooltip>
        );

        let iconName = '';
        let iconClassName = '';
        let spin = false;
        if (currentTtsId === this.ttsId) {
            if (currentTtsStatus) {
                iconName = 'stop-circle';
            } else {
                iconName = 'circle-o-notch';
                iconClassName = styles.smallIcon;
                spin = true;
            }
        } else {
            iconName = 'volume-up';
        }

        const button = (
            <button
                className={`${styles.ttsButton} ${this.props.additionalClass}`}
                id={this.props.id || this.ttsId}
                aria-label={this.getAriaLabel()}
                type="button"
                onClick={this.debouncedClick}
            >
                <FontAwesome className={iconClassName} name={iconName} size="lg" spin={spin} />
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
        tts: state.tts,
    }),
    {
        ...uiActions,
        ...ariaLiveActions,
        ...ttsActions,
    },
)(TTSButton);
