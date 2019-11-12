import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import Locales from '../../../../strings';
import styles from './styles.scss';
import palettes from '../../../palettes.json';
import MathButtonsGroup from '../../../Editor/components/MyWork/components/MathPalette/components/MathButtonsGroup';
import Button from '../../../Button';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class PaletteChooser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenPalettes: palettes.map(palette => palette.label),
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        $("input[type='checkbox']").prop('checked', true);
        mathLive.renderMathInDocument();
    }

    getApplicationNode = () => document.getElementById('contentContainer')

    handleChange(key) {
        if (this.state.chosenPalettes.indexOf(key) !== -1) {
            this.setState((prevState) => {
                let oldPalettes = prevState.chosenPalettes;
                oldPalettes = oldPalettes.filter(e => e !== key);
                return { chosenPalettes: oldPalettes };
            });
        } else {
            this.setState((prevState) => {
                const oldPalettes = prevState.chosenPalettes;
                oldPalettes.push(key);
                return { chosenPalettes: oldPalettes };
            });
        }
    }

    render() {
        const mathPalette = palettes.map((palette) => {
            const id = `key-${palette.label}`;
            const checkBoxId = `${id}-pallete-cb`;
            const labelId = `paletteLabel-${id}`;
            return (
                <div key={id} className={styles.paletteRow}>
                    <h2 id={labelId} className={styles.paletteLabel}>
                        {palette.label}
                    </h2>
                    <div id={`paletteButtons-${id}`} className={styles.paletteButtons}>
                        <MathButtonsGroup
                            palette={palette}
                            theActiveMathField={this.props.theActiveMathField}
                            showLabel={false}
                            labelId={labelId}
                            readOnly
                            hideShortcuts
                        />
                    </div>
                    <div id={`checkBox-${id}`} className={styles.checkBox}>
                        <input type="checkbox" name="name" id={checkBoxId} onChange={() => this.handleChange(palette.label)} />
                        <label htmlFor={checkBoxId} className="sROnly">
                            {palette.label}
                        </label>
                    </div>
                </div>
            );
        });
        const btnClassNames = [
            'btn',
            'pointer',
        ];
        return (
            <AriaModal
                id="modal"
                titleText={Locales.strings.math_palette}
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                focusDialog
                underlayStyle={{ paddingTop: '2em' }}
                dialogStyle={{ display: 'inline-table' }}
            >

                <div className={styles.container} id="container">
                    <h1 className={styles.title}>
                        {this.props.title}
                    </h1>
                    <form>
                        {mathPalette}
                    </form>
                    <div className={styles.footer}>
                        <Button
                            id="BtnCancel"
                            className={btnClassNames}
                            additionalStyles={['withHugeRightMargin', 'default']}
                            content={Locales.strings.cancel}
                            onClick={this.props.cancelCallback}
                        />
                        <Button
                            id="BtnSave"
                            className={btnClassNames}
                            additionalStyles={['default']}
                            content={Locales.strings.next}
                            onClick={() => { this.props.nextCallback(this.state.chosenPalettes); }}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}
