import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Layout, Menu,
} from 'antd';
import { goToPage, scrollTo, updateSideBarCollapsed } from '../../redux/ui/actions';
import { logoutOfUserProfile } from '../../redux/userProfile/actions';
import Locales from '../../strings';
import styles from './styles.scss';

const { Sider } = Layout;

class Sidebar extends React.Component {
    state = {
        contrast: 'standard',
        selectedKey: '',
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

    getMenu = () => {
        const { userProfile } = this.props;
        const menuList = [];
        if (userProfile.email) {
            if (userProfile.userType === 'student') {
                menuList.push({
                    key: 'my_solution_sets',
                    text: Locales.strings.my_solution_sets,
                });
                menuList.push({
                    key: 'my_created_sets',
                    text: Locales.strings.my_created_sets,
                });
            } else {
                menuList.push({
                    key: 'my_created_sets',
                    text: Locales.strings.my_created_sets,
                });
                menuList.push({
                    key: 'my_solution_sets',
                    text: Locales.strings.my_solution_sets,
                });
            }
        } else {
            menuList.push({
                key: 'my_sets',
                text: Locales.strings.my_sets,
            });
        }
        menuList.push({
            key: 'example_sets',
            text: Locales.strings.example_sets,
        });
        menuList.push({
            key: 'about_mathshare',
            text: Locales.strings.about_mathshare,
        });
        menuList.push({
            key: 'help_center',
            text: Locales.strings.help_center,
        });
        menuList.push({
            key: 'accessibility',
            text: Locales.strings.accessibility,
        });
        return menuList;
    }

    handleMenuSelect = (event) => {
        const { key } = event;
        this.setState({ selectedKey: key });
        if (!['my_sets', 'my_solution_sets', 'my_created_sets', 'example_sets'].includes(key)) {
            return null;
        }
        if (window.location.hash === '#/app') {
            this.props.scrollTo({
                scrollTo: key,
            });
        } else {
            this.props.goToPage({
                page: '/app',
                scrollTo: key,
            });
        }
        return null;
    }

    render() {
        const { routerHooks, userProfile, ui } = this.props;
        if (routerHooks.current === '/#/userDetailsEdit' || routerHooks.current === '/#/userDetails') {
            return null;
        }
        const active = routerHooks.current === '/#/app' ? this.state.selectedKey : '';
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
                    <Menu
                        mode="inline"
                        selectedKeys={[active]}
                        onSelect={this.handleMenuSelect}
                    >
                        {this.getMenu().map(menuItem => (
                            <Menu.Item key={menuItem.key}>
                                {menuItem.text}
                            </Menu.Item>
                        ))}
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
        goToPage,
        scrollTo,
        updateSideBarCollapsed,
        logoutOfUserProfile,
    },
)(Sidebar);
