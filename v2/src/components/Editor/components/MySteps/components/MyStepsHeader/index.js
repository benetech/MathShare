import React from 'react';
import classNames from 'classnames';
import header from './styles.scss';
import mySteps from '../../../../styles.scss';
import Locales from '../../../../../../strings';

const MyStepsHeader = (props) => {
    const title = props.readOnly ? Locales.strings.steps : Locales.strings.my_steps;
    return (
        <div className={header.container}>
            <h2 id="MySteps" tabIndex="-1">
                <span className={classNames(mySteps.modalAreaHeading, header.title)} aria-hidden="true">
                    {title}
                </span>
                <span className="sROnly">{Locales.strings.my_steps}</span>
            </h2>
        </div>
    );
};

export default MyStepsHeader;
