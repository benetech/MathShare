import React, {Component} from "react";
import MathButtonsRow from './components/MathButtonsRow';
import buttonsGroup from './styles.css';

export default class MathButtonsGroup extends Component {
    render() {
        const label = this.props.showLabel ? <span className={buttonsGroup.label} role="listitem">{this.props.palette.label}</span> : null;
        var rows = this.props.palette.buttonsRows.map((buttonsRow, i) =>
            <div key={i} role="list" className={buttonsGroup.row}>
                <MathButtonsRow
                    buttonsRow={buttonsRow}
                    palette={this.props.palette}
                    theActiveMathField={this.props.theActiveMathField}
                    readOnly={this.props.readOnly}
                />
            </div>
        );
        return (
            <div className={this.props.order}>
                {rows}
                {label}
            </div>
        );
    }
}
