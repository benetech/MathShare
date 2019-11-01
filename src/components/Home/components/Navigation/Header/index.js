import React from 'react';
import classNames from 'classnames';
import Locales from '../../../../../strings';
import styles from './styles.scss';

const NavigationHeader = ({ set }) => {
    if (!set.shareCode) {
        return null;
    }
    return (
        <div className="row">
            <div className={classNames('col-lg-12', 'm-3', (set.title ? `text-left ${styles.headingContainer}` : 'text-center'))}>
                <h1 id="LeftNavigationHeader" tabIndex="-1">{set.title || Locales.strings.untitled_problem_set}</h1>
                {!set.title && (
                    <p>{Locales.strings.select_a_problem}</p>
                )}
            </div>
        </div>
    );
};

export default NavigationHeader;
