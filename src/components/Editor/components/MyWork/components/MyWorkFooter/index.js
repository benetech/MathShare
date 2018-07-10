import React, { Component } from "react";
import MyWorkControlBtn from "../MyWorkControlBtn"
import classNames from "classnames";
import footer from './styles.css';
import styles from '../../../../../../styles/styles.css';
import buttons from '../../../../../../styles/buttons.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyWorkFooter extends Component {
    render() {
        const btnClassNames = [
            bootstrap.btn,
            buttons.default,
            styles.pointer
        ];

        return (
            <div className={footer.footer}>
                <div></div>
                <div className={bootstrap.row}>
                    <div
                        id="control-buttons"
                        className={
                            classNames(
                                bootstrap['col-lg-12'],
                                bootstrap['text-right']
                            )
                        }
                    >
                        <MyWorkControlBtn
                            id="BtnDiscard"
                            className={btnClassNames}
                            content="Discard"
                            withRightMargin
                        //TODO onclick="GoogleAnalytics('Discard');"
                        />
                        <MyWorkControlBtn
                            id="BtnSave"
                            className={btnClassNames}
                            content=" Done"
                            withRightMargin
                            step="5"
                            intro="Save your work or close out to try again from the beginning."
                            icon="thumbs-up"
                        //TODO onclick="GoogleAnalytics('Save');"
                        />
                        <MyWorkControlBtn
                            id="BtnClearAll"
                            className={btnClassNames}
                            content=" Clear all"
                            icon="times-circle"
                        //TODO onclick="clearAllSteps();"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
