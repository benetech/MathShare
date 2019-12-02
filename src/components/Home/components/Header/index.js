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
import { setDropdownId } from '../../../../redux/ui/actions';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import logo from '../../../../../images/mathshare_logo_white.png';
import logoutIcon from '../../../../../images/logout.svg';
import personalizationIcon from '../../../../../images/personalization.svg';
import {
    stopEvent,
    passEventForKeys,
} from '../../../../services/events';
import SkipContent from '../SkipContent';
import HeaderDropdown from '../../../HeaderDropdown';
import CommonDropdown from '../../../CommonDropdown';
import { PERSONALIZATION_SETTINGS } from '../../../ModalContainer';


class MainPageHeader extends React.Component {
    componentDidMount() {
        this.profileDropdownHandler();
    }

    componentDidUpdate() {
        this.profileDropdownHandler();
    }

    profileDropdownHandler = () => {
        document.querySelectorAll('li.avatar .dropdown-menu .dropdown-header').forEach((node) => {
            node.addEventListener('click', e => stopEvent(e));
        });
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

    openPersonalizationSettings = () => {
        this.props.toggleModals([
            PERSONALIZATION_SETTINGS,
        ]);
        this.props.setDropdownId();
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
                                <HeaderDropdown
                                    additionalClass={header.dropDownMenu}
                                    dropdownName={Locales.strings.help_center}
                                    dropdownIcon="question"
                                >
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
                                    <React.Fragment>
                                        <CommonDropdown
                                            btnId="navbarDropdownMenuLink-avatar"
                                            btnClass="nav-link reset-btn"
                                            containerClass="nav-item avatar"
                                            containerTag="li"
                                            btnContent={(
                                                <img
                                                    src={userProfile.profileImage}
                                                    className="rounded-circle z-depth-0"
                                                    alt={Locales.strings.user_profile}
                                                />
                                            )}
                                            listClass="dropdown-menu-lg-right dropdown-secondary"
                                        >
                                            <div className="dropdown-header">{userProfile.name}</div>
                                            <div className={`dropdown-header ${header.email}`}>{userProfile.email}</div>
                                            <div className="dropdown-divider" />
                                            <button
                                                className="dropdown-item reset-btn"
                                                onClick={this.openPersonalizationSettings}
                                                onKeyPress={
                                                    passEventForKeys(
                                                        this.openPersonalizationSettings,
                                                    )
                                                }
                                                type="button"
                                            >
                                                <img src={personalizationIcon} alt="" height="5" />
                                                {Locales.strings.personalization}
                                            </button>
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
                                                <img src={logoutIcon} alt="" height="5" />
                                                {Locales.strings.sign_out}
                                            </button>
                                        </CommonDropdown>
                                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-avatar" />
                                    </React.Fragment>
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
        setDropdownId,
        logoutOfUserProfile,
    },
)(MainPageHeader);
