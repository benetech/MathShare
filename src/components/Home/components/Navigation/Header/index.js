import React from 'react';
import classNames from 'classnames';
import Locales from '../../../../../strings';

const NavigationHeader = () => (
    <div className="row">
        <div className={classNames('col-lg-12', 'text-center')}>
            <h1 id="LeftNavigationHeader" tabIndex="-1">XXX MathShare beta</h1>
            <p>{Locales.strings.select_a_problem}</p>
            <br aria-hidden="true" />
            <br aria-hidden="true" />
            <h2 className={classNames('sr-only')}> XXX Problems</h2>
        </div>
    </div>
);

export default NavigationHeader;
