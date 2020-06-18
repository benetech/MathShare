import React, { Component } from 'react';
import { connect } from 'react-redux';
import AriaModal from 'react-aria-modal';
import { UncontrolledTooltip } from 'reactstrap';
import Slider from 'rc-slider';
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

export const configClassMap = {
    font: {
        'Open Dyslexic': 'open-dyslexic',
        'Comic Neue': 'comic-neue',
        'Courier Prime': 'courier-prime',
        'Open Sans': 'open-sans',
    },
};

const sliderHandle = (props) => {
    const {
        value, dragging, index, ...restProps
    } = props;
    return (
        <>
            <Slider.Handle id="slider-handle" value={value} {...restProps} />
            <UncontrolledTooltip placement="top" target="slider-handle" />
        </>
    );
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
    }

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

    updateSpeed = (speed) => {
        this.setState({
            tts: {
                speed,
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
            >
                <div id="personalization-modal" className={styles.modal}>
                    <div className={styles.modalBody}>
                        <h1 id="modalHeading">
                            {Locales.strings.personalization_settings}
                        </h1>
                        <div className={styles.formContainer}>
                            <div className={classNames('row')}>
                                <h2 id="uiHeader" className="sROnly">{Locales.strings.ui}</h2>
                                <ul className="row col-12" ariaLabelledBy="uiHeader">
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
                                                <div className="col-7">
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
                                <ul className="col-12" ariaLabelledBy="tts-heading">
                                    <li className="row">
                                        <h3 className="col-5" id="ttsSpeed" tabIndex="-1">
                                            {Locales.strings.speed}
                                        </h3>
                                        <div className={classNames('col-7', styles.ttsSpeed)}>
                                            <span>{Locales.strings.slower}</span>
                                            <Slider
                                                ariaLabelledByForHandle="ttsSpeed"
                                                defaultValue={this.state.tts.speed}
                                                min={0.5}
                                                step={0.05}
                                                max={1.5}
                                                handle={sliderHandle}
                                                onChange={this.updateSpeed}
                                            />
                                            <span>{Locales.strings.faster}</span>
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
