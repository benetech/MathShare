import React, { Component } from 'react';
import { connect } from 'react-redux';
import AriaModal from 'react-aria-modal';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';
import { savePersonalizationSettings } from '../../../../redux/userProfile/actions';

const defaultValues = {
    lineHeight: 1.5,
    letterSpacing: 0,
};

const fields = ['font', 'lineHeight', 'letterSpacing'];

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
            font: Object.keys(configClassMap.font),
            lineHeight: [1, 1.5, 2],
            letterSpacing: [0, 1, 2, 3, 5, 10],
        };
        let uiConfig = {};
        if (props.userProfile.config) {
            uiConfig = props.userProfile.config.ui;
        }
        this.state = {
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
        if (['lineHeight', 'letterSpacing'].includes(key)) {
            processedValue = Number(value);
        }
        this.setState({
            [key]: processedValue,
        });
    }

    render() {
        return (
            <AriaModal
                titleId="titleEditModal"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="personalization-modal" className={styles.modal}>
                    <div className={styles.modalBody}>
                        <h3>
                            {Locales.strings.personalization_settings}
                        </h3>
                        <div className={styles.formContainer}>
                            {fields.map((field) => {
                                const id = `per-${field}`;
                                return (
                                    <div className="row" key={id}>
                                        <div className="col-5">
                                            <label htmlFor={id}>
                                                <h4 tabIndex={-1}>
                                                    {Locales.strings[field] || field}
                                                </h4>
                                            </label>
                                        </div>
                                        <div className="col-7">
                                            <div className="form-group">
                                                <select className="form-control" id={id} onChange={this.handleChange(field)} value={this.state[field]}>
                                                    {defaultValues[field] === undefined && <option value="">{Locales.strings.system_default}</option>}
                                                    {this.optionList[field].map(value => (
                                                        <option key={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </select>
                                                <UncontrolledTooltip placement="top" target={id} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                    <footer className={styles.modalFooter}>
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
                    </footer>
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
