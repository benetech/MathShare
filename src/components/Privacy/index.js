import React from 'react';
// import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
// import homePhoto from '../../../images/home-photo.png';

const privacyLink = 'https://benetech.org/about/privacy-policy/';

const Privacy = () => (
    <div className={styles.container}>
        <div className={styles.logoContainer}>
            <a href="/#/">
                <img className={styles.midLogo} src={logo} alt={Locales.strings.mathshare_logo} />
            </a>
        </div>
        <div className={styles.headerBottom} />
        <div className={styles.content}>
            <div className={styles.header}>Privacy Policy</div>
            <div className={styles.textContent}>
                {Locales.strings.mathshare_privacy_1}
                {' '}
                <a href={privacyLink}>
                    {privacyLink}
                </a>
                {Locales.strings.mathshare_privacy_2}
                <div className={styles.metadata}>{Locales.strings.mathshare_privacy_updated}</div>
            </div>
        </div>
    </div>
);

export default Privacy;
