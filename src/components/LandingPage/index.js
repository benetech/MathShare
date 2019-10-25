import React from 'react';
import {
    withRouter,
} from 'react-router-dom';
import { IntercomAPI } from 'react-intercom';
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
        <Helmet>
            <title>
                {`${Locales.strings.overview} - ${Locales.strings.mathshare_benetech}`}
            </title>
        </Helmet>
        <SkipContent />
        <div className={styles.signInLabel}>
            <button
                className={`${styles.signIn} reset-btn`}
                onClick={clickOnSignIn(history, setAuthRedirect, userProfile)}
                onKeyPress={passEventForKeys(clickOnSignIn(history, setAuthRedirect, userProfile))}
                type="button"
                role="link"
            >
                {userProfile.service ? Locales.strings.go_to_app : Locales.strings.sign_in}
            </button>
        </div>
        <img className={styles.midLogo} src={logo} alt={Locales.strings.mathshare_logo} />
        <main id="mainContainer" className={styles.midContainer} aria-labelledby="help_students">
            <div className={styles.content}>
                <h1 id="help_students" className={styles.largeText} tabIndex={-1}>
                    {Locales.strings.help_students}
                </h1>
                <img src={homePhoto} alt={Locales.strings.screenshot_step_by_step} />
                <h2 className={styles.midBottomText} tabIndex={-1}>
                    {Locales.strings.benetech_empowers}
                </h2>
                <a
                    href="/#/app"
                    className={styles.btn}
                    onClick={clickOnTryNow(true)}
                    onKeyPress={passEventForKeys(clickOnTryNow(true))}
                    tabIndex="0"
                >
                    {Locales.strings.open_mathshare}
                </a>
            </div>
        </main>
        <div className={styles.features}>
            <div className={styles.content}>
                <section className={styles.feature} aria-labelledby="show_their_work">
                    <div className={styles.textSection}>
                        <h2 id="show_their_work" className={styles.header} tabIndex={-1}>
                            {Locales.strings.show_their_work}
                        </h2>
                        <h3 className={styles.textContent} tabIndex={-1}>
                            {Locales.strings.students_can_solve}
                        </h3>
                    </div>
                    <div className={styles.imageSection}>
                        <img src={showWork} alt={Locales.strings.screenshot_math_interface} />
                    </div>
                </section>
                <section className={`${styles.feature} ${styles.reverse}`} aria-labelledby="accessible_to_all">
                    <div className={styles.textSection}>
                        <h2 id="accessible_to_all" className={styles.header} tabIndex={-1}>
                            {Locales.strings.accessible_to_all}
                        </h2>
                        <h3 className={styles.textContent} tabIndex={-1}>
                            {Locales.strings.students_with_and_without}
                        </h3>
                    </div>
                    <div className={styles.imageSection}>
                        <img src={syntaxHighlighthing} alt={Locales.strings.mathshare_gif} />
                    </div>
                </section>
                <section className={styles.feature} aria-labelledby="lms_integration">
                    <div className={styles.textSection}>
                        <h2 id="lms_integration" className={styles.header} tabIndex={-1}>
                            {Locales.strings.lms_integration}
                        </h2>
                        <h3 className={styles.textContent} tabIndex={-1}>
                            {Locales.strings.use_on_your_lms}
                        </h3>
                    </div>
                    <div className={styles.imageSection}>
                        <img src={lms} alt={Locales.strings.mathshare_supported_lms} />
                    </div>
                </section>
                <section className={`${styles.feature} ${styles.reverse}`} aria-labelledby="free_and_open_source">
                    <div className={styles.textSection}>
                        <h2 id="free_and_open_source" className={styles.header} tabIndex={-1}>
                            {Locales.strings.free_and_open_source}
                        </h2>
                        <h3 className={styles.textContent} tabIndex={-1}>
                            {Locales.strings.mathshare_is_a_free}
                        </h3>
                    </div>
                    <div className={styles.imageSection}>
                        <img src={openSource} alt={Locales.strings.mathshare_open_source} />
                    </div>
                </section>
            </div>
        </div>
    </div>
));

export default LandingPage;
