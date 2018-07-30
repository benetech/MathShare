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
        this.saveSolution = this.saveSolution.bind(this);
    }

    discard() {
        if (confirm(Locales.strings.confirm_discard)) {
            this.props.history.goBack()
            googleAnalytics('Discard');
        }
    }

    saveSolution() {
        googleAnalytics('Save');
        this.props.history.goBack()
        this.props.savedProblem();
    }

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
                            content={Locales.strings.discard}
                            onClick={this.discard}
                        />
                        <Button
                            id="BtnSave"
                            className={btnClassNames}
                            content={Locales.strings.done}
                            additionalStyles={['withRightMargin', 'default']}
                            step="5"
                            intro={Locales.strings.save_intro}
                            icon="thumbs-up"
                            onClick={this.saveSolution}
                        />
                        <Button
                            id="BtnClearAll"
                            className={btnClassNames}
                            additionalStyles={['default']}
                            content={Locales.strings.clear_all}
                            icon="times-circle"
                            onClick={this.props.deleteStepsCallback}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
