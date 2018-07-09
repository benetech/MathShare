import React, {Component} from "react";
import MathButtonsGroup from './components/MathButtonsGroup';
import classNames from "classnames";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../../styles/styles.css';

export default class MathPalette extends Component {
    render() {
        initializeKeyShortcuts(palettes);
        //TODO: Include only allowed palettes
        var mathPalette = palettes.map((palette, i) =>
            <MathButtonsGroup key={i} order={"order-" + (i + 1)} palette={palette} />
        )
        return (
            <div id="mathPalette"
                className={classNames(bootstrap['col-lg-10'], bootstrap['pl-0'], bootstrap['d-flex'], bootstrap['flex-nowrap'])}>
                <h3 className={styles.sROnly}>math input buttons</h3>
                {mathPalette}
            </div>
        );
    }
}

/*
function paletteIsAllowed(palette) {
    var metadata = JSON.parse($("#ContentWrapper").attr("data-galois-metadata"));
    var allowedPalettes = metadata.palettes;
    var allowedPalettes;
    return !allowedPalettes || allowedPalettes.includes(palette.label);
}
*/
