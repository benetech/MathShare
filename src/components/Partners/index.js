import React from 'react';
// import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
// import homePhoto from '../../../images/home-photo.png';


const Partners = () => (
    <div className={styles.container}>
        <div className={styles.logoContainer}>
            <a href="/#/">
                <img className={styles.midLogo} src={logo} alt={Locales.strings.mathshare_logo} />
            </a>
        </div>
        <div className={styles.headerBottom} />
        <div className={styles.content}>
            <div className={styles.header}>Partnerships</div>
            <div className={styles.textContent}>
                Join us in making math more accessible for all students by becoming a partner.
                Mathshare is free and open source. Integrate it into your program or become a
                development partner. Please
                {' '}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeDijluYj0wyTz6OexPppVt9enX1QXpXSMPUflkdCtTBtv6HA/viewform">
                    complete this form
                </a>
                {' '}
                and we will be in touch soon.
            </div>
        </div>
    </div>
);

export default Partners;
