import React from 'react';
import classNames from 'classnames';
import Locales from '../../../../../strings';
import styles from './styles.scss';

const NavigationHeader = ({ set }) => {
    if (!set.shareCode) {
        return null;
    }
    let title = set.title;
    if (title && set.archiveMode) {
        title = `${set.archiveMode.toUpperCase()} - ${title}`;
    }
    return (
        <div className={classNames((title ? `text-left ${styles.headingContainer}` : 'text-center'))}>
            <h1 id="LeftNavigationHeader" tabIndex="-1">{title || Locales.strings.untitled_problem_set}</h1>
        </div>
    );
};

export default NavigationHeader;
