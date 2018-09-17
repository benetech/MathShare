import React, { Component } from "react";
import styles from './styles.css';
import Locales from '../../strings.js';
import MainPageHeader from '../Home/components/Header';
import MainPageFooter from '../Home/components/Footer';
import classNames from 'classnames';

export default class NotFound extends Component {
    render() {
        return (
            <div className={styles.container}>
                <MainPageHeader notFound />
                    <h1 id="NotFoundTitle" className={'sROnly'}>{Locales.strings.page_was_not_found_title}</h1>
                    <div className={classNames('row')}>
                        <div className={classNames('col-lg-12', 'text-center', styles.title)}>
                            <h1>{Locales.strings.page_was_not_found_title}</h1>
                        </div>
                    <h2 id="NotFoundContent" className={'sROnly'}>{Locales.strings.page_was_not_found}</h2>
                        <div className={classNames('col-lg-12', 'text-center')}>
                            <h2>{Locales.strings.page_was_not_found}</h2>
                        </div>
                    <h3 id="NotFoundInfo" className={'sROnly'}>{Locales.strings.page_was_not_found_info}</h3>
                        <div className={classNames('col-lg-12', 'text-center')}>
                            <h3>{Locales.strings.page_was_not_found_info}</h3>
                        </div>
                    </div>
                <MainPageFooter />
            </div>
        );
    }
}
