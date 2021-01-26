import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Layout, Menu, Radio,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMicrophone, faMinus, faPlus, faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { updateSideBarCollapsed } from '../../redux/ui/actions';
import { logoutOfUserProfile } from '../../redux/userProfile/actions';
import styles from './styles.scss';

const { Sider } = Layout;

class Sidebar extends React.Component {
    state = {
        contrast: 'standard',
    };

    handleContrastChange = (e) => {
        const contrast = e.target.value;
        this.setState({ contrast });
    };

    getRole = () => {
        const { userProfile } = this.props;
        const { info } = userProfile;
        if (info.userType === 'teacher') {
            return info.role;
        }
        return (info.userType || '').replace(/(^|\s)\S/g, t => t.toUpperCase());
    }

    render() {
        const { contrast } = this.state;
        const { routerHooks, userProfile, ui } = this.props;
        if (routerHooks.current === '/#/userDetailsEdit' || routerHooks.current === '/#/userDetails') {
            return null;
        }
        return (
            <Sider
                breakpoint="xl"
                width={325}
                collapsedWidth={0}
                theme="light"
                hidden={ui.sideBarCollapsed}
                onBreakpoint={(collapsed) => {
                    this.props.updateSideBarCollapsed(collapsed);
                }}
            >
                <div className={styles.sidebarContainer}>
                    {userProfile && userProfile.email && (
                        <div className={`${styles.profile} text-center`}>
                            <div className={`row justify-content-center ${styles.avatar}`}>
                                <div className="col-7">
                                    <img
                                        src={userProfile.profileImage || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'}
                                        alt=""
                                        className="img-fluid shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className={styles.name}>
                                {userProfile.name}
                            </div>
                            <div className={styles.title}>
                                {this.getRole()}
                            </div>
                            <Button
                                type="text"
                                className={styles.signout}
                                onClick={() => {
                                    this.props.logoutOfUserProfile();
                                }}
                            >
                                Signout
                            </Button>
                        </div>
                    )}
                    <div className={styles.actionButtons}>
                        <div>
                            <Button icon={<FontAwesomeIcon icon={faVolumeUp} size="2x" />} size="middle" />
                            <Button icon={<FontAwesomeIcon icon={faMicrophone} size="2x" />} size="middle" />
                        </div>
                        <div className="flex-end">
                            <Button
                                icon={(
                                    <>
                                        <span>A</span>
                                        <FontAwesomeIcon icon={faMinus} size="xs" />
                                    </>
                                )}
                                size="middle"
                            />
                            <Button
                                icon={(
                                    <>
                                        <span>A</span>
                                        <FontAwesomeIcon icon={faPlus} size="xs" />
                                    </>
                                )}
                                size="middle"
                            />
                        </div>
                    </div>
                    <div className={styles.contrastButtons}>
                        <Radio.Group
                            buttonStyle="solid"
                            onChange={this.handleContrastChange}
                            size="large"
                            value={contrast}
                            style={{ marginBottom: 8 }}
                        >
                            <Radio.Button value="standard">Standard</Radio.Button>
                            <Radio.Button value="high">High Contrast</Radio.Button>
                            <Radio.Button value="low">Low Contrast</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                    >
                        <Menu.Item key="1">
                            Home
                        </Menu.Item>
                        <Menu.Item key="2">
                            My Sets
                        </Menu.Item>
                        <Menu.Item key="3">
                            Example Sets
                        </Menu.Item>
                        <Menu.Item key="4">
                            About Mathshare
                        </Menu.Item>
                        <Menu.Item key="5">
                            Help
                        </Menu.Item>
                        <Menu.Item key="6">
                            Settings
                        </Menu.Item>
                    </Menu>
                </div>
            </Sider>
        );
    }
}

export default connect(
    state => ({
        routerHooks: state.routerHooks,
        userProfile: state.userProfile,
        ui: state.ui,
    }),
    {
        updateSideBarCollapsed,
        logoutOfUserProfile,
    },
)(Sidebar);
