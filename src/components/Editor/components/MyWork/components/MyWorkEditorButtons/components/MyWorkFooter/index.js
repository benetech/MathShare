import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import footer from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';
import Locales from '../../../../../../../../strings'

export default class MyWorkFooter extends Component {
    constructor(props) {
        super(props);
      
        this.discard = this.discard.bind(this);
    }

    discard() {
        if (confirm(Locales.strings.confirm_discard)) {
            this.props.history.goBack()
            googleAnalytics('Discard');
        }
    }

    render() {
        const btnClassNames = [
            bootstrap.btn,
            styles.pointer
        ];

        var leftButton = this.props.addingProblem ? 
        <Button
            id="BtnSave"
            className={btnClassNames}
            additionalStyles={['withRightMargin', 'default']}
            content={Locales.strings.save_button}
            onClick={this.props.saveCallback}
        /> :
        <Button
            id="BtnDiscard"
            className={btnClassNames}
            additionalStyles={['withRightMargin', 'default']}
            content={Locales.strings.discard}
            onClick={this.discard}
        />

        var rightButton = this.props.addingProblem ?
        <Button
            id="BtnCancel"
            className={btnClassNames}
            additionalStyles={['default']}
            content={Locales.strings.cancel}
            icon="times-circle"
            onClick={this.props.cancelCallback}
        /> :
        <Button
            id="BtnClearAll"
            className={btnClassNames}
            additionalStyles={['default']}
            content={Locales.strings.clear_all}
            icon="times-circle"
            onClick={this.props.deleteStepsCallback}
        />

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
                        {leftButton}
                        {rightButton}
                    </div>
                </div>
            </div>
        );
    }
}
