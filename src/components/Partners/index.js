import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
import { focusOnMainContent, passEventForKeys } from '../../services/events';
// import homePhoto from '../../../images/home-photo.png';

const Partners = () => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {`${Locales.strings.partners} - ${Locales.strings.mathshare_benetech}`}
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
            <h1 className={styles.header} tabIndex={-1}>
                {Locales.strings.partnerships}
            </h1>
            <div className={styles.textContent}>
                {Locales.strings.join_us_in_1}
            </div>
            <div className={styles.textContent}>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeDijluYj0wyTz6OexPppVt9enX1QXpXSMPUflkdCtTBtv6HA/viewform">
                    {Locales.strings.submit_a_partnership}
                </a>
            </div>
        </main>
    </div>
);

export default Partners;
