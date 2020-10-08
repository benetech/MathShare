import React from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { logoutOfUserProfile } from '../../redux/userProfile/actions';
import styles from './styles.scss';

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
    render() {
        const { userProfile } = this.props;
        const { email } = userProfile;
        const menu = (
            <Menu>
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
                    <div className={styles.header}>
                        Math
                        <span>(share)</span>
                    </div>
                </div>
                <div className={styles.right}>
                    {!email && (
                        <>
                            <Button type="link" href="/#/login">Login</Button>
                            <Button type="primary" href="/#/signUp">Sign up</Button>
                        </>
                    )}
                    {email && (
                        <>
                            <Dropdown className={styles.profileDropdown} overlay={menu} placement="bottomRight" arrow trigger={['click']}>
                                <Button type="default">
                                    <img
                                        src={userProfile.profileImage || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'}
                                        alt=""
                                        className="img-fluid shadow-lg"
                                    />
                                </Button>
                            </Dropdown>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        ui: state.ui,
        userProfile: state.userProfile,
    }),
    {
        logoutOfUserProfile,
    },
)(Header);
