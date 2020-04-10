import React from 'react';
// import { IntercomAPI } from 'react-intercom';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
import homePhoto from '../../../images/home-photo.png';
import showWork from '../../../images/show-work.png';
import openSource from '../../../images/open-source-software.png';
import lms from '../../../images/lms.png';
import syntaxHighlighthing from '../../../images/syntax-highlighting.gif';
import { passEventForKeys } from '../../services/events';
import SkipContent from '../Home/components/SkipContent';


// const clickOnTryNow = isTryNow => () => {
//     if (isTryNow) {
//         IntercomAPI('trackEvent', 'try-now');
//     } else {
//         IntercomAPI('trackEvent', 'create-account');
//     }
// };

const clickOnSignIn = (setAuthRedirect, userProfile) => () => {
    if (!userProfile.service) {
        setAuthRedirect('app');
    }
};

const renderButtons = (userProfile, setAuthRedirect) => {
    if (userProfile.service) {
        return (
            <div className={styles.headerBtnContainer}>
                <a
                    className={styles.signIn}
                    onClick={clickOnSignIn(setAuthRedirect, userProfile)}
                    onKeyPress={passEventForKeys(
                        clickOnSignIn(setAuthRedirect, userProfile),
                    )}
                    href="/#/app"
                >
                    {Locales.strings.go_to_app}
                </a>
            </div>
        );
    }
    return (
        <div className={styles.headerBtnContainer}>
            <a
                className={styles.signIn}
                onClick={clickOnSignIn(setAuthRedirect, userProfile)}
                onKeyPress={passEventForKeys(
                    clickOnSignIn(setAuthRedirect, userProfile),
                )}
                href="/#/signIn"
            >
                {Locales.strings.sign_in}
            </a>
            <a
                className={styles.signIn}
                onClick={clickOnSignIn(setAuthRedirect, userProfile)}
                onKeyPress={passEventForKeys(
                    clickOnSignIn(setAuthRedirect, userProfile),
                )}
                href="/#/signUp"
            >
                {Locales.strings.sign_up}
            </a>
        </div>
    );
};

const LandingPage = ({ setAuthRedirect, userProfile }) => {
    if (userProfile.email) {
        return <Redirect to="/app" />;
    }
    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {`${Locales.strings.overview} - ${Locales.strings.mathshare_benetech}`}
                </title>
            </Helmet>
            <header>
                <SkipContent />
                <div className={styles.signInLabel}>
                    {renderButtons(userProfile, setAuthRedirect)}
                </div>
                <div className={styles.logoContainer}>
                    <img
                        className={styles.midLogo}
                        src={logo}
                        alt={Locales.strings.mathshare_logo}
                    />
                </div>
            </header>
            <main id="mainContainer" className={styles.midContainer}>
                <div className={styles.content}>
                    <h1 id="help_students" className={styles.largeText} tabIndex={-1}>
                        {Locales.strings.help_students}
                    </h1>
                    <img src={homePhoto} alt={Locales.strings.screenshot_step_by_step} />
                    <p className={styles.midBottomText} tabIndex={-1}>
                        {Locales.strings.benetech_empowers}
                    </p>
                    <a
                        href="/#/app"
                        className={styles.btn}
                        // onClick={clickOnTryNow(true)}
                        // onKeyPress={passEventForKeys(clickOnTryNow(true))}
                        tabIndex="0"
                    >
                        {Locales.strings.open_mathshare}
                    </a>
                </div>
                <div className={styles.features}>
                    <div className={styles.content}>
                        <section className={styles.feature}>
                            <div className={styles.textSection}>
                                <h2 id="show_their_work" className={styles.header} tabIndex={-1}>
                                    {Locales.strings.show_their_work}
                                </h2>
                                <p className={styles.textContent} tabIndex={-1}>
                                    {Locales.strings.students_can_solve}
                                </p>
                            </div>
                            <div className={styles.imageSection}>
                                <img
                                    src={showWork}
                                    alt={Locales.strings.screenshot_math_interface}
                                />
                            </div>
                        </section>
                        <section className={`${styles.feature} ${styles.reverse}`}>
                            <div className={styles.textSection}>
                                <h2 id="accessible_to_all" className={styles.header} tabIndex={-1}>
                                    {Locales.strings.accessible_to_all}
                                </h2>
                                <p className={styles.textContent} tabIndex={-1}>
                                    {Locales.strings.students_with_and_without}
                                </p>
                            </div>
                            <div className={styles.imageSection}>
                                <img
                                    src={syntaxHighlighthing}
                                    alt={Locales.strings.mathshare_gif}
                                />
                            </div>
                        </section>
                        <section className={styles.feature}>
                            <div className={styles.textSection}>
                                <h2 id="lms_integration" className={styles.header} tabIndex={-1}>
                                    {Locales.strings.lms_integration}
                                </h2>
                                <p className={styles.textContent} tabIndex={-1}>
                                    {Locales.strings.use_on_your_lms}
                                </p>
                            </div>
                            <div className={styles.imageSection}>
                                <img src={lms} alt={Locales.strings.mathshare_supported_lms} />
                            </div>
                        </section>
                        <section className={`${styles.feature} ${styles.reverse}`}>
                            <div className={styles.textSection}>
                                <h2 id="free_and_open_source" className={styles.header} tabIndex={-1}>
                                    {Locales.strings.free_and_open_source}
                                </h2>
                                <p className={styles.textContent} tabIndex={-1}>
                                    {Locales.strings.mathshare_is_a_free}
                                </p>
                            </div>
                            <div className={styles.imageSection}>
                                <img src={openSource} alt={Locales.strings.mathshare_open_source} />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
