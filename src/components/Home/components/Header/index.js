import React from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import header from './styles.scss';
import UpcomingMobile from '../UpcomingMobile';
import Locales from '../../../../strings';
import {
    toggleModals,
} from '../../../../redux/problemList/actions';
import {
    openTour,
} from '../../../../redux/problem/actions';
import {
    logoutOfUserProfile,
    setAuthRedirect,
} from '../../../../redux/userProfile/actions';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import logo from '../../../../../images/mathshare_logo_white.png';
import {
    stopEvent,
    passEventForKeys,
} from '../../../../services/events';
import SkipContent from '../SkipContent';
import HeaderDropdown from '../../../HeaderDropdown';


class MainPageHeader extends React.Component {
    componentDidMount() {
        this.logoutClickHandler();
    }

    componentDidUpdate() {
        this.logoutClickHandler();
    }

    logoutClickHandler = () => {
        document.querySelectorAll('li.avatar .dropdown-menu > *').forEach((node) => {
            node.addEventListener('click', e => stopEvent(e));
        });
        const logout = document.querySelector('li.avatar .dropdown-menu .logout');
        if (logout) {
            logout.addEventListener('click', this.props.logoutOfUserProfile);
        }
    }

    onClickTutorial = () => {
        googleAnalytics(Locales.strings.tutorial);
        setTimeout(() => {
            this.props.openTour();
        }, 100);
    }

    openNewProblemSet = () => {
        window.open('/#/app/problemSet/new', '_blank');
    };

    setAuthRedirect = () => {
        this.props.setAuthRedirect('back');
    }

    render() {
        const { props } = this;
        const { userProfile } = props;

        return (
            <div id="topNavigationWrapper" className={header.header}>
                <header>
                    <nav
                        className={classNames(header.navbar, 'navbar-expand-lg', 'navbar')}
                        id="topNavigation"
                    >
                        <SkipContent />
                        <h2 id="topNavLabel" className="sROnly">{Locales.strings.header}</h2>
                        <div className={header.navbarBrandContainer}>
                            <a
                                className="navbar-brand"
                                href="#/app"
                                onClick={() => {
                                    googleAnalytics('clicked logo');
                                }}
                            >
                                <img src={logo} alt={Locales.strings.mathshare_benetech} height="37" />
                                <span className={header.beta}>{Locales.strings.beta}</span>
                            </a>
                        </div>
                        <div className="navbar-header pull-right">
                            <ul className="nav pull-left">
                                <HeaderDropdown additionalClass={header.dropDownMenu}>
                                    {[
                                        (props.action === 'new' || props.action === 'edit') && (
                                            <button
                                                className="dropdown-item reset-btn"
                                                onClick={this.openNewProblemSet}
                                                onKeyPress={
                                                    passEventForKeys(this.openNewProblemSet)
                                                }
                                                type="button"
                                                key="new-problem-set"
                                            >
                                                <FontAwesome
                                                    size="lg"
                                                    name="plus"
                                                />
                                                {` ${Locales.strings.add_problem_set}`}
                                                <span className="sROnly">
                                                    {'\u00A0'}
                                                    {Locales.strings.opens_in_new_tab}
                                                </span>
                                            </button>
                                        ),
                                        <a
                                            className="dropdown-item"
                                            href="/#/app/problem/example"
                                            onClick={this.onClickTutorial}
                                            onKeyPress={passEventForKeys(this.onClickTutorial)}
                                            key="example-problem"
                                        >
                                            <FontAwesome
                                                className="super-crazy-colors"
                                                name="hand-o-up"
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                            {Locales.strings.tutorial}
                                        </a>,
                                    ]}
                                </HeaderDropdown>
                                {!userProfile.service && (
                                    <li>
                                        <a
                                            id="signIn"
                                            className={`nav-link btn ${header.signInLink}`}
                                            href="/#/signIn"
                                            onClick={this.setAuthRedirect}
                                            onKeyPress={passEventForKeys(this.setAuthRedirect)}
                                        >

                                            {Locales.strings.sign_in}
                                            <FontAwesome
                                                size="lg"
                                                name="user-circle-o"
                                            />
                                        </a>
                                        <UncontrolledTooltip placement="top" target="signIn" />
                                    </li>
                                )}
                                {userProfile.service && (
                                    <li className="nav-item avatar dropdown">
                                        <button
                                            className="nav-link dropdown-toggle reset-btn"
                                            id="navbarDropdownMenuLink-avatar"
                                            data-toggle="dropdown"
                                            type="button"
                                            aria-expanded="false"
                                        >
                                            <img
                                                src={userProfile.profileImage}
                                                className="rounded-circle z-depth-0"
                                                alt={Locales.strings.user_profile}
                                            />
                                        </button>
                                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-avatar" />
                                        <ul
                                            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                            aria-labelledby="navbarDropdownMenuLink-avatar"
                                        >
                                            <li><div className="dropdown-header">{userProfile.name}</div></li>
                                            <li><div className={`dropdown-header ${header.email}`}>{userProfile.email}</div></li>
                                            <li><div className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item logout reset-btn"
                                                    onClick={this.props.logoutOfUserProfile}
                                                    onKeyPress={
                                                        passEventForKeys(
                                                            this.props.logoutOfUserProfile,
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    {Locales.strings.sign_out}
                                                </button>

                                            </li>
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                    <UpcomingMobile />
                </header>
            </div>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.userProfile,
    }),
    {
        toggleModals,
        openTour,
        setAuthRedirect,
        logoutOfUserProfile,
    },
)(MainPageHeader);
