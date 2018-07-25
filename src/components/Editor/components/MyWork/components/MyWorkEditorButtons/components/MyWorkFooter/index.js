import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import footer from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import googleAnalytics from '../../../../../../../../scripts/googleAnalytics';

export default class MyWorkFooter extends Component {
    constructor(props) {
        super(props);
      
        this.discard = this.discard.bind(this);
        this.saveSolution = this.saveSolution.bind(this);
    }

    discard() {
        if (confirm("Any work on this problem will NOT be saved")) {
            this.props.history.goBack()
            googleAnalytics('Discard');
        }
    }

    saveSolution() {
        googleAnalytics('Save');
        this.props.history.goBack()
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
                            content="Discard"
                            onClick={this.discard}
                        />
                        <Button
                            id="BtnSave"
                            className={btnClassNames}
                            content=" Done"
                            additionalStyles={['withRightMargin', 'default']}
                            step="5"
                            intro="Save your work or close out to try again from the beginning."
                            icon="thumbs-up"
                            onClick={this.saveSolution}
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
