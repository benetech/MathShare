import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';

const NotFound = () => (
    <div className={styles.container}>
        <MainPageHeader notFound />
        <div className={classNames('row')}>
            <div className={classNames('col-lg-12', 'text-center', styles.title)}>
                <h1 tabIndex={-1}>{Locales.strings.page_was_not_found_title}</h1>
            </div>
            <div className={classNames('col-lg-12', 'text-center')}>
                <p className={styles.h2}>{Locales.strings.page_was_not_found}</p>
                <p className={styles.h3}>{Locales.strings.page_was_not_found_info}</p>
            </div>
        </div>
    </div>
);

export default NotFound;
