import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import footer from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyWorkFooter extends Component {

    render() {
        const btnClassNames = [
            bootstrap.btn,
            styles.pointer
        ];

        return (
            <div className={footer.footer} style={this.props.hide ? {display: 'none'} : {}}>
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
                        <Button
                            id="BtnDiscard"
                            className={btnClassNames}
                            additionalStyles={['withRightMargin', 'default']}
                            content="Discard"
                            onClick={this.props.discardCallback}
                        />
                        <Button
                            id="BtnSave"
                            className={btnClassNames}
                            content=" Done"
                            additionalStyles={['withRightMargin', 'default']}
                            step="5"
                            intro="Save your work or close out to try again from the beginning."
                            icon="thumbs-up"
                            onClick={this.props.doneCallback}
                        />
                        <Button
                            id="BtnClearAll"
                            className={btnClassNames}
                            additionalStyles={['default']}
                            content=" Clear all"
                            icon="times-circle"
                            onClick={this.props.deleteStepsCallback}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
