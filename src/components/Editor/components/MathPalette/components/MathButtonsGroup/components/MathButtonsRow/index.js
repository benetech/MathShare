import React from "react";
import MathButton from './components/MathButton';

export default class MathButtonsRow extends React.Component {
    render() {
        return (
            this.props.buttonsRow.map((button, i) =>
                <MathButton key={i} button={button} palette={this.props.palette}/>
            )
        );
    }
}
