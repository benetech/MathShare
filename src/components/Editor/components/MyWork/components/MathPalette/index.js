import React, {Component} from "react";
import MathButtonsGroup from './components/MathButtonsGroup';
import classNames from "classnames";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../../../../styles/styles.css';
import paletteStyle from './styles.css';
import palettes from './palettes.json';
import Locales from '../../../../../../strings'

export default class MathPalette extends Component {
    initializeKeyShortcuts(palettes) {
        var keyShortcuts = new Map();
        palettes.forEach(function(palette) {
            palette.buttonsRows.forEach(function(buttonsRow) {
                buttonsRow.forEach(function(button) {
                    if (button.keys) {
                        keyShortcuts.set(button.keys.sort().join(''), button.id);
                    }
                });
            });
        });
        sessionStorage.keyShortcuts = JSON.stringify(Array.from(keyShortcuts.entries()));
    }

    render() {
        var allowedPalettes = palettes.filter(palette => 
            (!this.props.allowedPalettes || this.props.allowedPalettes.includes(palette.label)));
        this.initializeKeyShortcuts(allowedPalettes);
        var mathPalette = allowedPalettes.map((palette, i) =>
            <MathButtonsGroup
                key={i}
                order={"order-" + (i + 1)}
                palette={palette}
                theActiveMathField={this.props.theActiveMathField}
            />
        )
        return (
            <div id="mathPalette"
                className={
                    classNames(
                        bootstrap['pl-0'],
                        bootstrap['d-flex'],
                        bootstrap['flex-nowrap'],
                        paletteStyle.mathPalette
                    )
                }
            >
                <h3 className={styles.sROnly}>{Locales.strings.math_input_buttons}</h3>
                {mathPalette}
            </div>
        );
    }
}
