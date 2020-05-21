import React, { Component } from 'react';

class Toggle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: props.defaultPressed,
        };
    }

    getClassNames = () => {
        const classList = ['switchToggle'];
        classList.push(this.props.btnClass);
        return classList.join(' ');
    }

    sendCallback = (value) => {
        if (this.props.callback) {
            this.props.callback(value);
        }
    }

    toggleState = () => {
        this.setState((prevState) => {
            const pressed = !prevState.pressed;
            this.sendCallback(pressed);
            return { pressed };
        });
    }

    render() {
        const {
            pressed,
        } = this.state;
        return (
            <button
                className={this.getClassNames()}
                type="button"
                aria-pressed={pressed}
                onClick={this.toggleState}
            >
                {this.props.text}
                <span className="switchToggle__ui" aria-hidden="true" />
            </button>
        );
    }
}

export default Toggle;
