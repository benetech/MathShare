import React, {Component} from "react";
import MathButtonsRow from './components/MathButtonsRow';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import buttonsGroup from './styles.css';

export default class MathButtonsGroup extends Component {
    render() {
        var rows = this.props.palette.buttonsRows.map((buttonsRow, i) =>
            <div key={i} className={buttonsGroup.row}>
                <MathButtonsRow buttonsRow={buttonsRow} palette={this.props.palette}/>
                <br/>
            </div>
        );
        return (
            <div className={bootstrap[this.props.order]}>{rows}</div>
        );
    }
}
