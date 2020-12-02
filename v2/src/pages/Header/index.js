import React from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { logoutOfUserProfile } from '../../redux/userProfile/actions';
import Locales from '../../strings';
import styles from './styles.scss';

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
    render() {
        const { userProfile, routerHooks } = this.props;
        const { email, name } = userProfile;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div>{name}</div>
                    <div>{email}</div>
                </Menu.Item>
                <Menu.Item>
                    <Button
                        type="text"
                        onClick={(e) => {
                            this.props.logoutOfUserProfile();
                            e.preventDefault();
                        }}
                    >
                        Signout
                    </Button>
                </Menu.Item>
            </Menu>
        );
        if (routerHooks.current === '/#/userDetailsEdit' || routerHooks.current === '/#/userDetails') {
            return null;
        }
        return (
            <div className={`row ${styles.loginPromptContainer}`}>
                <div className={styles.left}>
                    {/* {!sideBarCollapsed && !email && (
                        <div className={styles.notLoggedInContainer}>
                            <div>
                                <span role="img" aria-label="point up">&#9757;</span>
                            </div>
                            <div>
                                <div className={styles.notLoggedIn}>You are not logged in.</div>
                                <div className={styles.prompt}>
                                    Save this link to return to your set later
                                </div>
                            </div>
                        </div>
                    )} */}
                    <a className={styles.header} href="/#/app">
                        <img src="https://mathshare-qa.diagramcenter.org/images/logo-black.png" alt="logo" />
                        <span className={styles.beta}>beta</span>
                    </a>
                </div>
                <div className={styles.right}>
                    {!email && (
                        <span className={styles.loginButtons}>
                            <Button type="link" href="/#/login">Login</Button>
                            <Button type="primary" href="/#/signUp">Sign up</Button>
                        </span>
                    )}
                    {email && (
                        <span className={styles.profileButton}>
                            <Dropdown
                                className={styles.profileDropdown}
                                overlay={menu}
                                placement="bottomRight"
                                arrow
                                trigger={['click']}
                            >
                                <Button
                                    type="default"
                                    aria-label={Locales.strings.user_profile}
                                >
                                    <img
                                        src={userProfile.profileImage || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'}
                                        alt=""
                                        className="img-fluid shadow-lg"
                                    />
                                </Button>
                            </Dropdown>
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        routerHooks: state.routerHooks,
        ui: state.ui,
        userProfile: state.userProfile,
    }),
    {
        logoutOfUserProfile,
    },
)(Header);
