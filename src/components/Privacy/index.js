import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
import { focusOnMainContent, passEventForKeys } from '../../services/events';
// import homePhoto from '../../../images/home-photo.png';

const privacyLink = 'https://benetech.org/about/privacy-policy/';

const Privacy = () => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {`${Locales.strings.policies} - ${Locales.strings.mathshare_benetech}`}
            </title>
        </Helmet>
        <header>
            <button
                data-skip-link
                onClick={focusOnMainContent}
                onKeyPress={passEventForKeys(focusOnMainContent)}
                type="button"
            >
                {Locales.strings.go_to_main_content}
            </button>
            <div className={styles.logoContainer}>
                <button
                    data-skip-link
                    onClick={focusOnMainContent}
                    onKeyPress={passEventForKeys(focusOnMainContent)}
                    type="button"
                >
                    {Locales.strings.go_to_main_content}
                </button>
                <a href="/#/">
                    <img
                        className={styles.midLogo}
                        src={logo}
                        alt={Locales.strings.mathshare_logo}
                    />
                </a>
            </div>
            <div className={styles.headerBottom} />
        </header>
        <main id="mainContainer" className={styles.content}>
            <h1 className={styles.header} tabIndex={-1}>Privacy Policy</h1>
            <div className={styles.textContent}>
                {Locales.strings.mathshare_privacy_1}
                {' '}
                <a href={privacyLink}>
                    {privacyLink}
                </a>
                {Locales.strings.mathshare_privacy_2}
                <div className={styles.metadata}>{Locales.strings.mathshare_privacy_updated}</div>
            </div>
        </main>
    </div>
);

export default Privacy;
