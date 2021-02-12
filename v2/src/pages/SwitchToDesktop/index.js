import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { displayAlert } from '../../services/alerts';
import Locales from '../../strings';
import styles from './styles.scss';

/* eslint-disable react/prefer-stateless-function */
class SwitchToDesktop extends React.Component {
    switchToDesktop = () => {
        try {
            localStorage.setItem('msVersion', 1);
            window.location.reload();
        } catch (error) {
            displayAlert('warning', Locales.strings.unable_to_switch_to_v1, 'Warning');
        }
    }

    render() {
        const { routerHooks } = this.props;
        if (routerHooks.current !== '/#/app') {
            return null;
        }
        return (
            <div className={`row ${styles.switchContainer}`}>
                <div className={styles.left}>
                    {Locales.strings.welcome_to_mobile}
                </div>
                <div className={styles.right}>
                    <span className={styles.buttons}>
                        <Button
                            type="primary"
                            icon={<FontAwesomeIcon icon={faDesktop} />}
                            onClick={this.switchToDesktop}
                        >
                            {Locales.strings.desktop_view}
                        </Button>
                    </span>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        routerHooks: state.routerHooks,
        ui: state.ui,
    }),
    {},
)(SwitchToDesktop);
