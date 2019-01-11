import React from 'react';
import classNames from 'classnames';
import Locales from '../../../../../strings';

const NavigationHeader = () => (
    <div className="row">
        <div className={classNames('col-lg-12', 'text-center')}>
            <h1 id="LeftNavigationHeader" tabIndex="-1">{Locales.strings.select_a_problem}</h1>
            <br aria-hidden="true" />
            <br aria-hidden="true" />
        </div>
    </div>
);

export default NavigationHeader;
