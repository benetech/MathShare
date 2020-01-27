import React, { Component } from 'react';
import classNames from 'classnames';
import MathButtonsGroup from './components/MathButtonsGroup';
import paletteStyle from './styles.scss';
import palettes from '../../../../../palettes.json';
import Locales from '../../../../../../strings';
import { sessionStore } from '../../../../../../scripts/storage';
import { alertWarning } from '../../../../../../scripts/alert';

/* eslint-disable react/no-string-refs */
export default class MathPalette extends Component {
    componentDidMount() {
        try {
            this.props.InitScratchPad();
        } catch (e) {
            alertWarning(Locales.strings.sketchpad_loading_warning, 'Warning');
        }
        this.refs.scratchpad.style.display = 'none';
    }

    initializeKeyShortcuts = (palettesParam) => {
        const keyShortcuts = new Map();
        palettesParam.forEach((palette) => {
            palette.buttonsRows.forEach((buttonsRow) => {
                buttonsRow.forEach((button) => {
                    if (button.keys) {
                        keyShortcuts.set(button.keys.sort().join(''), button.id);
                    }
                });
            });
        });
        sessionStore.setItem('keyShortcuts', JSON.stringify(Array.from(keyShortcuts.entries())))
    }

    render() {
        const allowedPalettes = palettes.filter(palette => (!this.props.allowedPalettes
            || this.props.allowedPalettes.length === 0
            || this.props.allowedPalettes.includes(palette.label)));
        this.initializeKeyShortcuts(allowedPalettes);
        const mathPalette = allowedPalettes.map((palette, i) => (
            <MathButtonsGroup
                key={i}
                order={`order-${i + 1}`}
                palette={palette}
                theActiveMathField={this.props.theActiveMathField}
                showLabel
            />
        ));

        const symbolsContainer = !this.props.scratchpadMode
            ? (
                <div
                    id="mathPalette"
                    className={classNames(
                        'pl-0',
                        'd-flex',
                        'flex-nowrap',
                        paletteStyle.mathPalette,
                    )}
                >
                    <h2 className="sROnly">{Locales.strings.math_input_buttons}</h2>
                    {mathPalette}
                </div>
            ) : null;

        const border = this.props.scratchpadMode ? paletteStyle.scratchBorder
            : paletteStyle.symbolsBorder;

        return (
            <div className={classNames(paletteStyle.inputContainer, border)}>
                <div
                    id="scratch-pad-containter"
                    ref="scratchpad"
                    className={classNames(
                        'order-0',
                        paletteStyle.scratchPadContainter,
                    )}
                />
                {symbolsContainer}
            </div>
        );
    }
}
