import React, { Component } from "react";
import AriaModal from "react-aria-modal";
import Locales from '../../../../strings'
import styles from './styles.css';
import palettes from '../../../palettes.json';
import MathButtonsGroup from '../../../Editor/components/MyWork/components/MathPalette/components/MathButtonsGroup';
import Button from '../../../Button';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class PaletteChooser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenPalettes: palettes.map(palette => palette.label)
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        $("input[type='checkbox']").prop("checked", true);
        mathLive.renderMathInDocument();
    }

    getApplicationNode() {
        return document.getElementById('root');
    };

    handleChange(key) {
        if(this.state.chosenPalettes.indexOf(key) != -1) {
            var oldPalettes = this.state.chosenPalettes;
            oldPalettes = oldPalettes.filter(e => e !== key)
            this.setState({chosenPalettes: oldPalettes});
        } else {
            var oldPalettes = this.state.chosenPalettes;
            oldPalettes.push(key)
            this.setState({chosenPalettes: oldPalettes});
        }
    }

    render() {
        var mathPalette = palettes.map((palette, i) =>
        <div key={i} className={styles.paletteRow}>
            <div id="paletteButtons" className={styles.paletteButtons}>
                <MathButtonsGroup
                    palette={palette}
                    theActiveMathField={this.props.theActiveMathField}
                    showLabel={false}
                    readOnly
                />
            </div>
            <h5 id="paletteLabel" className={styles.paletteLabel}>
                {palette.label}
            </h5>
            <div id="checkBox" className={styles.checkBox}>
                <input type="checkbox" name="name" onChange={(event) => this.handleChange(palette.label)}/>
            </div>
        </div>
        )
        const btnClassNames = [
            'btn',
            'pointer'
        ];
        return (
            <AriaModal
                id="modal"
                titleText="demo one"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                focusDialog={true}
                underlayStyle={{ paddingTop: '2em' }}
            >
                
                <div className={styles.container} id="container">
                    <h3 className={styles.title}>
                        {this.props.title}
                    </h3>
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
                        onClick={() => {this.props.nextCallback(this.state.chosenPalettes)}}
                    />
                    </div>
                </div>
            </AriaModal>
        );
    }
}
