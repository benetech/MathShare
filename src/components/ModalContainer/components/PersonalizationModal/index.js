import React, { Component } from 'react';
import { connect } from 'react-redux';
import AriaModal from 'react-aria-modal';
import lodash from 'lodash';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';
import { savePersonalizationSettings } from '../../../../redux/userProfile/actions';

const defaultValues = {
    ui: {
        lineHeight: 1.5,
        letterSpacing: 0,
        alertAutoClose: 10,
    },
    tts: {
        speed: 1.0,
    },
};

const fields = ['font', 'lineHeight', 'letterSpacing', 'alertAutoClose'];

const speedLabels = [
    {
        value: 0,
        text: 'Slowest',
    },
    {
        value: 25,
        text: '',
    },
    {
        value: 50,
        text: 'Medium',
    },
    {
        value: 75,
        text: '',
    },
    {
        value: 100,
        text: 'Fastest',
    },
];

export const configClassMap = {
    font: {
        'Open Dyslexic': 'open-dyslexic',
        'Comic Neue': 'comic-neue',
        'Courier Prime': 'courier-prime',
        'Open Sans': 'open-sans',
    },
};

class PersonalizationModal extends Component {
    constructor(props) {
        super(props);
        this.optionList = {
            ui: {
                font: Object.keys(configClassMap.font),
                lineHeight: [1, 1.5, 2],
                letterSpacing: [0, 1, 2, 3, 5, 10],
                alertAutoClose: [5, 10, 15, 20],
            },
        };
        let uiConfig = {};
        if (props.userProfile.config) {
            uiConfig = props.userProfile.config.ui;
        }
        this.state = {
            ui: {
                ...fields.reduce((currentState, field) => {
                    let value = currentState[field];
                    if (typeof (value) === 'undefined' || value === '') {
                        value = defaultValues[field];
                    }
                    if (typeof (value) === 'undefined') {
                        value = '';
                    }
                    return {
                        ...currentState,
                        [field]: value,
                    };
                }, uiConfig),
            },
            tts: {
                speed: props.userProfile.config.tts.speed || defaultValues.tts.speed,
            },
        };
        this.debouncedUpdateSpeed = lodash.debounce(this.updateSpeed, 300, {
            leading: true,
            trailing: true,
        });
        this.debouncedHandleSpeedChange = lodash.debounce(this.handleSpeedChange, 300, {
            leading: true,
            trailing: true,
        });
    }

    covertValue = value => (
        0.2 + (1.6 * value / 100)
    )

    convertTTSBackendValue = value => (Math.round(
        (value - 0.2) / 1.6 * 100,
    ) || 0)

    save = () => {
        this.props.savePersonalizationSettings(this.state);
        this.props.deactivateModal();
    }

    handleChange = key => (event) => {
        const target = event.target;
        const value = target.value;
        let processedValue = value;
        if (['lineHeight', 'letterSpacing', 'alertAutoClose'].includes(key)) {
            processedValue = Number(value);
        }
        this.setState(prevState => ({
            ui: {
                ...prevState.ui,
                [key]: processedValue,
            },
        }));
    }

    updateSpeed = () => {
        const speedElement = document.getElementById('ttsSpeedSlider');
        if (!speedElement) {
            return;
        }
        const rawValue = Number(speedElement.value);
        if (this.state.rawValue === rawValue) {
            return;
        }
        this.setState({
            tts: {
                speed: this.covertValue(rawValue),
                rawValue,
            },
        });
    }

    handleSpeedChange = (e) => {
        const rawValue = e.target.value || 0;
        if (this.state.rawValue === rawValue) {
            return;
        }
        this.setSpeed(rawValue)();
    }

    setSpeed = rawValue => () => {
        if (this.state.rawValue === rawValue) {
            return;
        }
        const speedElement = document.getElementById('ttsSpeedSlider');
        if (!speedElement) {
            return;
        }
        speedElement.value = rawValue;
        this.setState({
            tts: {
                speed: this.covertValue(rawValue),
                rawValue,
            },
        });
    }

    render() {
        return (
            <AriaModal
                titleId="modalHeading"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
                initialFocus="modalHeading"
            >
                <div id="personalization-modal" className={styles.modal}>
                    <div className={styles.modalBody}>
                        <h1 id="modalHeading">
                            {Locales.strings.personalization_settings}
                        </h1>
                        <div className={styles.formContainer}>
                            <div className={classNames('row')}>
                                <h2 id="uiHeader" className="sROnly">{Locales.strings.ui}</h2>
                                <ul className="row col-12" aria-labelledby="uiHeader">
                                    {fields.map((field) => {
                                        const id = `per-${field}`;
                                        return (
                                            <li className="row" key={id}>
                                                <div className="col-5">
                                                    <label htmlFor={id}>
                                                        <h3 tabIndex={-1}>
                                                            {Locales.strings[field] || field}
                                                        </h3>
                                                    </label>
                                                </div>
                                                <div className="col-5">
                                                    <div className="form-group">
                                                        <select className="form-control" id={id} onChange={this.handleChange(field)} value={this.state.ui[field]}>
                                                            {defaultValues.ui[field] === undefined && <option value="">{Locales.strings.system_default}</option>}
                                                            {this.optionList.ui[field]
                                                                .map(value => (
                                                                    <option key={value}>
                                                                        {value}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <UncontrolledTooltip placement="top" target={id} />
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className={classNames('row', styles.ttsContainer)}>
                                <h2 className="col-12" id="tts-heading">{Locales.strings.tts}</h2>
                                <ul className="col-12" aria-labelledby="tts-heading">
                                    <li className="row">
                                        <div className="col-5">
                                            <label htmlFor="ttsSpeedSlider">
                                                <h3 tabIndex={-1}>
                                                    {Locales.strings.speed}
                                                </h3>
                                            </label>
                                        </div>
                                        <div className={classNames('col-5', styles.ttsSpeed)}>
                                            <input
                                                id="ttsSpeedSlider"
                                                aria-labelledby="ttsSpeed"
                                                type="range"
                                                min={0}
                                                step={5}
                                                max={100}
                                                defaultValue={
                                                    this.convertTTSBackendValue(
                                                        this.state.tts.speed,
                                                    )
                                                }
                                                onChange={this.debouncedUpdateSpeed}
                                            />
                                            <ul className={styles.rangeLabels}>
                                                {speedLabels.map(speedLabel => (
                                                    <li>
                                                        <button
                                                            className={speedLabel.text ? '' : styles.smallLine}
                                                            type="button"
                                                            onClick={
                                                                this.setSpeed(speedLabel.value)
                                                            }
                                                            aria-hidden="true"
                                                            tabIndex={-1}
                                                        >
                                                            {speedLabel.text ? (
                                                                <>
                                                                    <div
                                                                        className={styles.smallLine}
                                                                    >
                                                                        |
                                                                    </div>
                                                                    <span>{speedLabel.text}</span>
                                                                </>
                                                            ) : '|'}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className={classNames('col-2', styles.ttsNumberInput)}>
                                            <div className="form-group">
                                                <input
                                                    id="ttsSpeedNumberIp"
                                                    aria-labelledby="ttsSpeed"
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    defaultValue={
                                                        this.convertTTSBackendValue(
                                                            this.state.tts.speed,
                                                        )
                                                    }
                                                    value={
                                                        this.convertTTSBackendValue(
                                                            this.state.tts.speed,
                                                        )
                                                    }
                                                    onChange={this.debouncedHandleSpeedChange}
                                                />
                                                <UncontrolledTooltip placement="top" target="ttsSpeedNumberIp" />
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <Button
                            id="save_title"
                            className={classNames('btn', 'btn-primary', styles.button)}
                            ariaHidden="false"
                            type="button"
                            icon="save"
                            content={Locales.strings.save}
                            onClick={this.save}
                        />
                        <Button
                            id="deactivate"
                            className={classNames('btn', 'btn-primary')}
                            ariaHidden="false"
                            type="button"
                            icon="times"
                            content={Locales.strings.close}
                            onClick={this.props.deactivateModal}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.userProfile,
    }),
    {
        savePersonalizationSettings,
    },
)(PersonalizationModal);
