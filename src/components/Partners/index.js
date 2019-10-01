import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.scss';
import Locales from '../../strings';
import logo from '../../../images/logo-2.png';
// import homePhoto from '../../../images/home-photo.png';


const Partners = () => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {`${Locales.strings.partners} - ${Locales.strings.mathshare_benetech}`}
            </title>
        </Helmet>
        <div className={styles.logoContainer}>
            <a href="/#/">
                <img className={styles.midLogo} src={logo} alt={Locales.strings.mathshare_logo} />
            </a>
        </div>
        <div className={styles.headerBottom} />
        <div className={styles.content}>
            <div className={styles.header}>{Locales.strings.partnerships}</div>
            <div className={styles.textContent}>
                {Locales.strings.join_us_in_1}
                {' '}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeDijluYj0wyTz6OexPppVt9enX1QXpXSMPUflkdCtTBtv6HA/viewform">
                    {Locales.strings.join_us_in_2}
                </a>
                {' '}
                {Locales.strings.join_us_in_3}
            </div>
        </div>
    </div>
);

export default Partners;
