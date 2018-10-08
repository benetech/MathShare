import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.css';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
        };
    }

    componentDidUpdate() {
        if (this.props.content !== this.state.content) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ content: this.props.content });
        }
    }

    buildClassNames() {
        let additionalStyles = [];
        if (this.props.additionalStyles) {
            additionalStyles = this.props.additionalStyles.map(
                style => styles[style],
            );
        }
        return classNames(
            this.props.className,
            additionalStyles,
        );
    }

    render() {
        let span;
        if (this.props.icon) {
            span = this.props.fa5
                ? (
                    <FontAwesomeIcon
                        size={this.props.iconSize ? this.props.iconSize : 'lg'}
                        className="super-crazy-colors"
                        icon={this.props.icon}
                    />
                )
                : (
                    <FontAwesome
                        size={this.props.iconSize ? this.props.iconSize : 'lg'}
                        className="super-crazy-colors"
                        name={this.props.icon}
                    />
                );
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                disabled={this.props.disabled}
                id={this.props.id}
                className={this.buildClassNames()}
                aria-hidden={this.props.ariaHidden}
                type={this.props.type}
                title={this.props.title}
                data-step={this.props.intro}
                data-intro={this.props.step}
                data-toggle={this.props.toggle}
                onClick={this.props.onClick}
                style={this.props.hide ? { display: 'none' } : {}}
            >
                {span}
                {this.state.content}
            </button>
        );
    }
}
