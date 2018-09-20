import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import styles from './styles.css';
import Locales from '../../../../../../../../strings';

export default class InputContainerSelectors extends Component {
    render() {
        const scratchClass = this.props.scratchpadMode ? styles.scratchActive : styles.disabled;
        const symbolsClass = !this.props.scratchpadMode ? styles.symbolsActive : styles.disabled;

        return (
            <div id="inputContainersSelectors" className={
                classNames(
                    styles.container
                )
            }>
                <Button
                    className={classNames([
                        'btn',
                        styles.scratch,
                        styles.button,
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
                        'btn',
                        styles.symbols,
                        styles.button,
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
