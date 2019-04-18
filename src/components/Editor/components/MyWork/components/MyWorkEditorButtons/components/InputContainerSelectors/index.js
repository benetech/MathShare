import React from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import styles from './styles.css';
import Locales from '../../../../../../../../strings';

const InputContainerSelectors = (props) => {
    const scratchClass = props.scratchpadMode ? styles.scratchActive : styles.disabled;
    const symbolsClass = !props.scratchpadMode ? styles.symbolsActive : styles.disabled;

    return (
        <div
            id="inputContainersSelectors"
            className={
                classNames([
                    'd-flex',
                    'flex-column',
                    styles.container,
                ])
            }
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
        </div>
    );
};

export default InputContainerSelectors;
