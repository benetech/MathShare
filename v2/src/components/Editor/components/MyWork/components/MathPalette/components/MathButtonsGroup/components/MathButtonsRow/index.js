import React, { Component } from 'react';
import MathButton from './components/MathButton';

export default class MathButtonsRow extends Component {
    render() {
        return (
            this.props.buttonsRow.map((button, i) => (
                <MathButton
                    key={i}
                    button={button}
                    palette={this.props.palette}
                    theActiveMathField={this.props.theActiveMathField}
                    readOnly={this.props.readOnly}
                    hideShortcuts={this.props.hideShortcuts}
                />
            ))
        );
    }
}
