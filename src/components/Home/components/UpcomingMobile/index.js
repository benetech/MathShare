import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import upcoming from './styles.scss';
import Button from '../../../Button';
import { setMobileNotify } from '../../../../redux/userProfile/actions';
import { alertWarning } from '../../../../scripts/alert';
import Locales from '../../../../strings';

class UpcomingMobileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailMode: false,
            email: '',
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
        const { routerHooks } = this.props;
        if (routerHooks.current !== '/#/app') {
            return null;
        }
        return (
            <nav
                className={classNames(upcoming.navbar, 'navbar-expand-lg', 'navbar')}
                aria-labelledby="mobile-not-supported"
            >
                <h2 id="mobile-not-supported" className="text-center">
                    {Locales.strings.mobile_not_supported_v2}
                </h2>
                <div className={classNames(upcoming.fullWidth)}>
                    {!this.state.emailMode && (
                        <Button
                            id="upcoming-mobile"
                            className={classNames('btn', 'btn-primary', upcoming.getNotified)}
                            ariaHidden="false"
                            type="button"
                            icon="check"
                            ariaLabel={Locales.strings.mobile_view.trim()}
                            content={Locales.strings.mobile_view}
                            onClick={() => {
                                try {
                                    localStorage.setItem('msVersion', 2);
                                    window.location.reload();
                                } catch (error) {
                                    alertWarning(
                                        Locales.strings.unable_to_switch_to_v2,
                                        Locales.strings.warning,
                                    );
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
                </div>
            </nav>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.userProfile,
        routerHooks: state.routerHooks,
    }),
    {
        setMobileNotify,
    },
)(UpcomingMobileHeader);
