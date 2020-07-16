import React from 'react';
import Locales from '../../../../strings';
import styles from './styles.scss';
import palettes from '../../../palettes.json';
import MathButtonsGroup from '../../../Editor/components/MyWork/components/MathPalette/components/MathButtonsGroup';
import Button from '../../../Button';
import CommonModal, { CommonModalHeader, AriaModalDefaultProps } from '../../../ModalContainer/components/CommonModal';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class PaletteChooser extends CommonModal {
    constructor(props) {
        super(props);
        let chosenPalettes = palettes.map(palette => palette.label);
        if (props.isUpdate && props.currentPalettes) {
            chosenPalettes = props.currentPalettes;
        }
        this.state = {
            chosenPalettes,
        };
    }

    componentDidMount() {
        if (!this.props.isUpdate) {
            $("input[type='checkbox']").prop('checked', true);
        }
        mathLive.renderMathInDocument();
    }

    getApplicationNode = () => document.getElementById('contentContainer')

    handleChange = (key) => {
        if (this.state.chosenPalettes.indexOf(key) !== -1) {
            this.setState(prevState => ({
                chosenPalettes: prevState.chosenPalettes.filter(e => e !== key),
            }));
        } else {
            this.setState(prevState => ({
                chosenPalettes: [
                    ...prevState.chosenPalettes,
                    key,
                ],
            }));
        }
    }

    render() {
        const { isUpdate } = this.props;
        const { chosenPalettes } = this.state;
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
                        <input
                            type="checkbox"
                            name="name"
                            id={checkBoxId}
                            onChange={() => this.handleChange(palette.label)}
                            checked={chosenPalettes.includes(palette.label)}
                        />
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
            <AriaModalDefaultProps
                handleModalExit={this.handleModalExit}
                {...this.props}
            >
                <div className={styles.container} id="container">
                    <CommonModalHeader className={styles.title}>
                        {this.props.title}
                    </CommonModalHeader>
                    <form>
                        {mathPalette}
                    </form>
                    <div className={styles.footer}>
                        <Button
                            id="BtnCancel"
                            className={btnClassNames}
                            additionalStyles={['withHugeRightMargin', 'default']}
                            content={Locales.strings.cancel}
                            onClick={this.handleModalExit()}
                        />
                        <Button
                            id="BtnSave"
                            className={btnClassNames}
                            additionalStyles={['default']}
                            content={isUpdate ? Locales.strings.save : Locales.strings.next}
                            onClick={this.handleModalExit(() => {
                                this.props.nextCallback(this.state.chosenPalettes);
                            }, true)}
                        />
                    </div>
                </div>
            </AriaModalDefaultProps>
        );
    }
}
