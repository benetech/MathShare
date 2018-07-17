import React, {Component} from "react";
import classNames from "classnames";
import styles from '../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class NavigationHeader extends Component {
    render() {
        return (
            <div>
                <h2 id="LeftNavigationHeader" className={styles.sROnly}> Problems to solve </h2>
                <div className={bootstrap.row}>
                    <div className={classNames(bootstrap['col-lg-12'], bootstrap['text-center'])}>
                        <h2>Select a problem and try out Benetech's Math Editor (alpha)!</h2>
                        <br/><br/>
                    </div>
                </div>
            </div>
        );
    }
}