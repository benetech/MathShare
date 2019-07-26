import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import Locales from '../../strings';
import MainPageHeader from '../Home/components/Header';

const NotFound = () => (
    <div className={styles.container}>
        <MainPageHeader notFound />
        <h1 id="NotFoundTitle" className="sROnly">{Locales.strings.page_was_not_found_title}</h1>
        <div className={classNames('row')}>
            <div className={classNames('col-lg-12', 'text-center', styles.title)}>
                <h1>{Locales.strings.page_was_not_found_title}</h1>
            </div>
            <h2 id="NotFoundContent" className="sROnly">{Locales.strings.page_was_not_found}</h2>
            <div className={classNames('col-lg-12', 'text-center')}>
                <h2>{Locales.strings.page_was_not_found}</h2>
            </div>
            <h3 id="NotFoundInfo" className="sROnly">{Locales.strings.page_was_not_found_info}</h3>
            <div className={classNames('col-lg-12', 'text-center')}>
                <h3>{Locales.strings.page_was_not_found_info}</h3>
            </div>
        </div>
    </div>
);

export default NotFound;
