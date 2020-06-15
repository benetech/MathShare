import React from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import styles from './styles.scss';
import Locales from '../../../../../../../../strings';

const InputContainerSelectors = (props) => {
    const scratchClass = props.scratchpadMode ? styles.scratchActive : styles.disabled;
    const symbolsClass = !props.scratchpadMode ? styles.symbolsActive : styles.disabled;

    return (
        <section
            id="inputContainersSelectors"
            className={
                classNames([
                    'd-flex',
                    'flex-column',
                    styles.container,
                    styles.inputContainersSelectors,
                ])
            }
            aria-label={Locales.strings.select_symbol_or_scratchpad}
        >
            <Button
                id="switchToSymbolsBtn"
                className={[
                    'btn',
                    styles.symbols,
                    styles.button,
                    symbolsClass,
                ]}
                fa5
                icon="square-root-alt"
                content={Locales.strings.symbols}
                toggle="tooltip"
                title={Locales.strings.switch_to_symbols}
                onClick={() => props.hideScratchpad()}
            />
            <Button
                id="switchToScratchPadBtn"
                className={classNames([
                    'btn',
                    styles.scratch,
                    styles.button,
                    scratchClass,
                ])}
                fa5
                icon="signature"
                content={Locales.strings.scratchpad}
                toggle="tooltip"
                title={Locales.strings.switch_to_sketchpad}
                onClick={() => props.openScratchpad()}
            />
        </section>
    );
};

export default InputContainerSelectors;
