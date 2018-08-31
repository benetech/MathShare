import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import styles from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../../../../../strings';

export default class InputContainerSelectors extends Component {
    render() {
        const scratchClass = this.props.scratchpadMode ? styles.scratchActive : styles.disabled;
        const symbolsClass = !this.props.scratchpadMode ? styles.symbolsActive : styles.disabled;

        return (
            <div className={
                classNames(
                    styles.container
                )
            }>
                <Button
                    className={classNames([
                        bootstrap.btn,
                        styles.scratch,
                        styles.btn,
                        scratchClass
                    ])}
                    fa5
                    icon="signature"
                    content={Locales.strings.scratchpad}
                    toggle="tooltip"
                    title={Locales.strings.switch_to_sketchpad}
                    onClick={() => this.props.openScratchpad()}
                />
                <Button
                    className={[
                        bootstrap.btn,
                        styles.symbols,
                        styles.btn,
                        symbolsClass
                    ]}
                    fa5
                    icon="square-root-alt"
                    content={Locales.strings.symbols}
                    toggle="tooltip"
                    title={Locales.strings.switch_to_symbols}
                    onClick={() => this.props.hideScratchpad()}
                />
            </div>
        );
    }
}
