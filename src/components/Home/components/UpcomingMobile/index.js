import React from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as dayjs from 'dayjs';
import upcoming from './styles.scss';
import Button from '../../../Button';
import { setMobileNotify } from '../../../../redux/userProfile/actions';
import { alertWarning } from '../../../../scripts/alert';
import Locales from '../../../../strings';
import { sessionStore } from '../../../../scripts/storage';

class UpcomingMobileHeader extends React.Component {
    constructor(props) {
        super(props);
        const expiry = sessionStore.getItem('hide_mobile_support_banner');
        let hide = !isMobile;
        if (!hide && expiry && dayjs().isBefore(dayjs(expiry))) {
            hide = true;
        }
        this.state = {
            emailMode: false,
            email: '',
            hide,
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            hide: !isMobile
                || (!props.checking && (
                    (props.userProfile.service === null && state.hide)
                    || props.userProfile.notifyForMobile !== null)
                ),
        };
    }

    submitNotifyMobile = () => {
        if (!/\S+@\S+\.\S+/.test(this.state.email)) {
            alertWarning(Locales.strings.please_enter_valid_email, Locales.strings.warning);
            return;
        }
        this.props.setMobileNotify(1, this.state.email);
    }

    render() {
        const { userProfile } = this.props;
        if (this.state.hide) {
            return null;
        }
        return (
            <nav
                className={classNames(upcoming.navbar, 'navbar-expand-lg', 'navbar')}
                aria-labelledby="mobile-not-supported"
            >
                <h2 id="mobile-not-supported" className="text-center">
                    {Locales.strings.mobile_not_supported}
                </h2>
                <div className={classNames(upcoming.fullWidth)}>
                    {!this.state.emailMode && (
                        <Button
                            id="upcoming-mobile"
                            className={classNames('btn', 'btn-primary', upcoming.getNotified)}
                            ariaHidden="false"
                            type="button"
                            icon="check"
                            content={Locales.strings.get_notified_about_mobile}
                            onClick={() => {
                                if (userProfile.email) {
                                    this.props.setMobileNotify(1);
                                } else {
                                    this.setState({
                                        emailMode: true,
                                    }, () => {
                                        setTimeout(() => {
                                            const inform = document.getElementById('inform-email');
                                            if (inform) {
                                                inform.focus();
                                            }
                                        }, 0);
                                    });
                                }
                            }}
                        />
                    )}
                    {this.state.emailMode && (
                        <div className={upcoming.inputContainer}>
                            <input
                                id="inform-email"
                                type="email"
                                placeholder={Locales.strings.enter_your_email}
                                value={this.state.email}
                                onChange={(e) => {
                                    this.setState({
                                        email: e.target.value,
                                    });
                                }}
                            />
                            <Button
                                id="submit"
                                className={classNames('btn', 'btn-primary')}
                                ariaHidden="false"
                                type="button"
                                icon="check"
                                onClick={this.submitNotifyMobile}
                            />
                        </div>
                    )}
                    <Button
                        id="close-upcoming-mobile"
                        className={classNames('btn', 'btn-warning')}
                        ariaHidden="false"
                        type="button"
                        icon="times"
                        onClick={() => {
                            if (userProfile.email) {
                                this.props.setMobileNotify(2);
                            } else {
                                this.setState({
                                    hide: true,
                                }, () => {
                                    sessionStore.setItem('hide_mobile_support_banner', dayjs().add(1, 'hour').toISOString());
                                });
                            }
                        }}
                    />
                </div>
            </nav>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.userProfile,
    }),
    {
        setMobileNotify,
    },
)(UpcomingMobileHeader);
