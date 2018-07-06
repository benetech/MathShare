import React from "react";
import classNames from "classnames";
import header from './styles.css';
import mySteps from '../../../../styles.css';
import styles from '../../../../../../styles/styles.css';

export default class MyStepsHeader extends React.Component {
    render() {
        return (
            <div>
                <h2 id="MySteps" tabIndex="-1">
                    <span className={classNames(mySteps.modalAreaHeading, header.title)} aria-hidden="true">
                        My Steps
                    </span>
                    <span className={styles.sROnly}>My Steps</span>
                </h2>
            </div>
        );
    }
}
