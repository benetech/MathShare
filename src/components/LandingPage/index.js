import React from 'react';
import {
    withRouter,
} from 'react-router-dom';
import { IntercomAPI } from 'react-intercom';
// import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
import homePhoto from '../../../images/home-photo.png';
import showWork from '../../../images/show-work.png';
import openSource from '../../../images/open-source-software.png';
import lms from '../../../images/lms.png';
import syntaxHighlighthing from '../../../images/syntax-highlighting.gif';
import { focusOnMainContent, passEventForKeys } from '../../services/events';


const clickOnTryNow = isTryNow => () => {
    if (isTryNow) {
        IntercomAPI('trackEvent', 'try-now');
    } else {
        IntercomAPI('trackEvent', 'create-account');
    }
};

const clickOnSignIn = (history, setAuthRedirect, userProfile) => () => {
    if (userProfile.service) {
        history.push('/app');
    } else {
        setAuthRedirect('app');
        history.push('/signIn');
    }
};

const LandingPage = withRouter(({ history, setAuthRedirect, userProfile }) => (
    <div className={styles.container}>
        <div>
            <button
                type="button"
                className={styles.skipBtn}
                tabIndex={0}
                onClick={focusOnMainContent}
                onKeyPress={passEventForKeys(focusOnMainContent)}
            >
                {Locales.strings.go_to_main_content}
            </button>
        </div>
        <div className={styles.signInLabel}>
            <button
                className={`${styles.signIn} reset-btn`}
                onClick={clickOnSignIn(history, setAuthRedirect, userProfile)}
                onKeyPress={passEventForKeys(clickOnSignIn(history, setAuthRedirect, userProfile))}
                type="button"
            >
                {userProfile.service ? 'Go to App' : 'Sign In'}
            </button>
        </div>
        <img className={styles.midLogo} src={logo} alt={Locales.strings.mathshare_logo} />
        <div id="mainContainer" className={styles.midContainer}>
            <div className={styles.content}>
                <h1 className={styles.largeText} tabIndex={-1}>
                    Help students show and organize their math work
                </h1>
                <img src={homePhoto} alt="mid-logo" aria-label={Locales.strings.screenshot_step_by_step} />
                <div className={styles.midBottomText}>
                    Benetech Mathshare empowers students to solve math problems and
                    {' '}
                    show their work so that teachers and students can see how they got there.
                </div>
                <a
                    href="/#/app"
                    className={styles.btn}
                    onClick={clickOnTryNow(true)}
                    onKeyPress={passEventForKeys(clickOnTryNow(true))}
                    tabIndex="0"
                >
                    Try now
                </a>
            </div>
        </div>
        <div className={styles.features}>
            <div className={styles.content}>
                <hr />
                <div className={`${styles.feature} ${styles.reverse}`}>
                    <div className={styles.imageSection}>
                        <img src={showWork} alt={Locales.strings.screenshot_math_interface} />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            Show their work
                        </div>
                        <div className={styles.textContent}>
                            Students can solve equations step-by-step
                            {' '}
                            and add notes to explain their thinking.
                        </div>
                    </div>
                </div>
                <hr />
                <div className={styles.feature}>
                    <div className={styles.imageSection}>
                        <img src={syntaxHighlighthing} alt={Locales.strings.mathshare_gif} />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            Accessible to ALL Learners
                        </div>
                        <div className={styles.textContent}>
                            Students with and without learning differences can use
                            {' '}
                            Mathshare with features like text-to-speech, speech-to-text,
                            {' '}
                            and word-level highlighting
                        </div>
                    </div>
                </div>
                <hr />
                <div className={`${styles.feature} ${styles.reverse}`}>
                    <div className={styles.imageSection}>
                        <img src={lms} alt={Locales.strings.mathshare_supported_lms} />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            LMS Integration
                        </div>
                        <div className={styles.textContent}>
                            Use on your schools LMS (learning management system)
                            {' '}
                            through assignment links, with native integrations and
                            {' '}
                            single sign on (SSO) coming soon.
                        </div>
                    </div>
                </div>
                <hr />
                <div className={styles.feature}>
                    <div className={styles.imageSection}>
                        <img src={openSource} alt={Locales.strings.mathshare_open_source} />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            Free and Open Source
                        </div>
                        <div className={styles.textContent}>
                            Mathshare is a free, open source tool developed by
                            {' '}
                            Benetech, a nonprofit that empowers communities with
                            {' '}
                            software for social good. Mathshare’s mission is to
                            {' '}
                            make math accessible for all students. Mathshare is
                            {' '}
                            free for schools to use and for learning management
                            {' '}
                            systems to integrate into their platforms.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

export default LandingPage;
