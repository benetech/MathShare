import React from 'react';
// import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
// import homePhoto from '../../../images/home-photo.png';


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
                Mathshare shares the Benetech privacy policy which is found at
                {' '}
                <a href="https://benetech.org/about/privacy-policy/">
                    https://benetech.org/about/privacy-policy/
                </a>
                . When signing in using an LMS or other
                sign in service we request and store the following information from the service.
                First and last name, email, and user ID.
                Mathshare uses this data to maintain or administer our Services, perform
                business analyses, or for other internal purposes to improve the quality of our
                business, the Services, and other products and services we offer. We may use
                information provided by you in other manners, as otherwise described to you at
                the point of collection or pursuant to your consent.
                Data is stored securely in the United States.
                <div className={styles.metadata}>Updated 7-2-19</div>
            </div>
        </div>
    </div>
);

export default Privacy;
