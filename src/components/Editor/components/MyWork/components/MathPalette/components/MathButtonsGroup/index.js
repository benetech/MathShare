import React, {Component} from "react";
import MathButtonsRow from './components/MathButtonsRow';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import buttonsGroup from './styles.css';

export default class MathButtonsGroup extends Component {
    render() {
        const label = <span className={buttonsGroup.label} role="listitem">{this.props.palette.label}</span>;
        var rows = this.props.palette.buttonsRows.map((buttonsRow, i) =>
            <div key={i} role="list" className={buttonsGroup.row}>
                <MathButtonsRow
                    buttonsRow={buttonsRow}
                    palette={this.props.palette}
                    theActiveMathField={this.props.theActiveMathField}
                />
            </div>
        );
        return (
            <div className={bootstrap[this.props.order]}>
                {rows}
                {label}
            </div>
        );
    }
}
