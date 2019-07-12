import React from 'react';
import {
    withRouter,
} from 'react-router-dom';
// import classNames from 'classnames';
import styles from './styles.scss';
// import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
import homePhoto from '../../../images/home-photo.png';
import showWork from '../../../images/show-work.png';
import openSource from '../../../images/open-source-software.png';
import lms from '../../../images/lms.png';
import syntaxHighlighthing from '../../../images/syntax-highlighting.gif';


const LandingPage = withRouter(({ history }) => (
    <div className={styles.container}>
        <img className={styles.midLogo} src={logo} alt="mid-logo" aria-label="Mathshare Logo, a Benetech Initiative" />
        <div className={styles.midContainer}>
            <div className={styles.content}>
                <div className={styles.largeText}>
                    Help students show and organize their math work
                </div>
                <img src={homePhoto} alt="mid-logo" aria-label="Screenshot showing example problem being solved step by step" />
                <div className={styles.midBottomText}>
                    Benetech Mathshare empowers students to solve math problems and
                    {' '}
                    show their work so that teachers and students can see how they got there
                </div>
                <div
                    className={styles.btn}
                    onClick={() => {
                        history.push('/app');
                    }}
                    onKeyPress={() => {
                        history.push('/app');
                    }}
                    role="link"
                    tabIndex="0"
                >
                    Try now
                </div>
            </div>
        </div>
        <div className={styles.features}>
            <div className={styles.content}>
                <hr />
                <div className={`${styles.feature} ${styles.reverse}`}>
                    <div className={styles.imageSection}>
                        <img src={showWork} alt="show-work" aria-label="Screen shot showing math share interface" />
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
                        <img src={syntaxHighlighthing} alt="show-work" aria-label="animation showing math with synchronized highlighting" />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            Accessible to ALL Learners
                        </div>
                        <div className={styles.textContent}>
                            Students with and without learning differences can use
                            {' '}
                            Mathshare withfeatures like text-to-speech, speech-to-text,
                            {' '}
                            and word-level highlighting
                        </div>
                    </div>
                </div>
                <hr />
                <div className={`${styles.feature} ${styles.reverse}`}>
                    <div className={styles.imageSection}>
                        <img src={lms} alt="lms" aria-label="image showing several logos of LMS vendors" />
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
                        <img src={openSource} alt="open-source" aria-label="Image showing open source logo" />
                    </div>
                    <div className={styles.textSection}>
                        <div className={styles.header}>
                            Free and Open Source
                        </div>
                        <div className={styles.textContent}>
                            Mathshare is a free,open source tool developed by
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
                <div
                    className={`${styles.btn} ${styles.signupBtn}`}
                    onClick={() => {
                        history.push('/app');
                    }}
                    onKeyPress={() => {
                        history.push('/app');
                    }}
                    role="link"
                    tabIndex="0"
                >
                    Create Free Account
                </div>
            </div>
        </div>
    </div>
));

export default LandingPage;
