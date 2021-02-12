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
        siderClass: '',
        selectedKey: '',
    };

    componentDidMount = () => {
        this.checkCurrentActiveOption();
        this.updateSiderClass();
    }

    updateSiderClass = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            this.setState({ siderClass: '' });
        } else {
            const top = sidebar.getBoundingClientRect().top;
            if (top > 0) {
                this.setState({ siderClass: '' });
            } else {
                this.setState({ siderClass: styles.affix });
            }
        }
        setTimeout(this.updateSiderClass, 100);
    }

    getTop = (obj) => {
        if (obj.type === 'external') {
            return 0;
        }
        const element = document.getElementById(obj.key);
        if (element) {
            return element.getBoundingClientRect().top;
        }
        return 0;
    }

    checkCurrentActiveOption = () => {
        const { problemSetList } = this.props;
        const { exampleProblemSets, recentProblemSets, recentSolutionSets } = problemSetList;
        if (exampleProblemSets.loading || recentProblemSets.loading || recentSolutionSets.loading) {
            setTimeout(this.checkCurrentActiveOption, 300);
            return;
        }
        if (window.location.hash !== '#/app') {
            this.setState({
                selectedKey: '',
            });
            setTimeout(this.checkCurrentActiveOption, 300);
            return;
        }
        const menu = this.getMenu().map(obj => ({
            ...obj,
            offset: this.getTop(obj),
        }));
        const firstNonNegativeIndex = Math.max(0, menu.findIndex(item => item.offset >= 0));
        if (menu[firstNonNegativeIndex].offset < (window.innerHeight * 0.5) && menu[firstNonNegativeIndex].type !== 'external') {
            this.setState({
                selectedKey: menu[firstNonNegativeIndex].key,
            });
        } else {
            this.setState({
                selectedKey: menu[Math.max(firstNonNegativeIndex - 1, 0)].key,
            });
        }
        setTimeout(this.checkCurrentActiveOption, 300);
    }

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
                    type: 'internal',
                });
                menuList.push({
                    key: 'my_created_sets',
                    text: Locales.strings.my_created_sets,
                    type: 'internal',
                });
            } else {
                menuList.push({
                    key: 'my_created_sets',
                    text: Locales.strings.my_created_sets,
                    type: 'internal',
                });
                menuList.push({
                    key: 'my_solution_sets',
                    text: Locales.strings.my_solution_sets,
                    type: 'internal',
                });
            }
        } else {
            menuList.push({
                key: 'my_sets',
                text: Locales.strings.my_sets,
                type: 'internal',
            });
        }
        menuList.push({
            key: 'example_sets',
            text: Locales.strings.example_sets,
            type: 'internal',
        });
        menuList.push({
            key: 'about_mathshare',
            text: Locales.strings.about_mathshare,
            type: 'external',
            href: 'https://mathsharedev.benetech.org/about/',
        });
        menuList.push({
            key: 'help_center',
            text: Locales.strings.help_center,
            type: 'external',
            href: 'https://mathsharedev.benetech.org/help/',
        });
        menuList.push({
            key: 'accessibility',
            text: Locales.strings.accessibility,
            type: 'external',
            href: 'https://mathsharedev.benetech.org/accessibility-2/',
        });
        return menuList;
    }

    handleMenuSelect = (event) => {
        const { userProfile } = this.props;
        const { email } = userProfile;
        const { key } = event;
        if (!['my_sets', 'my_solution_sets', 'my_created_sets', 'example_sets'].includes(key)) {
            return null;
        }
        this.setState({ selectedKey: key });
        if (window.location.hash === '#/app') {
            this.props.scrollTo({
                scrollTo: key,
            });
        } else {
            const waitForEvents = ['REQUEST_EXAMPLE_SETS_COMPLETE'];
            if (email) {
                waitForEvents.push('REQUEST_RECENT_SETS_recentProblemSets_COMPLETE');
                waitForEvents.push('REQUEST_RECENT_SETS_recentSolutionSets_COMPLETE');
            }
            this.props.goToPage({
                page: '/app',
                scrollTo: key,
                waitForEvents,
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
                id="sidebar"
                className={styles.sidebar}
                breakpoint="xl"
                width={325}
                collapsedWidth={0}
                theme="light"
                hidden={ui.sideBarCollapsed}
                onBreakpoint={(collapsed) => {
                    this.props.updateSideBarCollapsed(collapsed);
                }}
            >
                <div className={`${styles.sidebarContainer} ${this.state.siderClass}`}>
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
                            <Menu.Item key={menuItem.key} aria-label={`${active === menuItem.key ? 'Current: ' : ''}${menuItem.text}`}>
                                {menuItem.type === 'external' ? (
                                    <a href={menuItem.href} target="_blank" rel="noopener noreferrer">
                                        {menuItem.text}
                                    </a>
                                ) : menuItem.text}
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
        problemSetList: state.problemSetList,
        ui: state.ui,
    }),
    {
        goToPage,
        scrollTo,
        updateSideBarCollapsed,
        logoutOfUserProfile,
    },
)(Sidebar);
