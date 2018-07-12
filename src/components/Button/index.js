import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import styles from './styles.css';
import mathlive from 'mathlive';

export default class Button extends Component {
    buildClassNames() {
        var additionalStyles = [];
        if (this.props.additionalStyles) {
            additionalStyles = this.props.additionalStyles.map(
                style => {
                    return styles[style]
                }
            )
        }
        return classNames(
            this.props.className,
            additionalStyles
        )
    }

    componentDidMount() {
        mathlive.renderMathInDocument();
    }

    render() {
        var span;
        if (this.props.icon) {
            span = <FontAwesome
                className='super-crazy-colors'
                name={this.props.icon}
            />
        }

        return (
            <button
                id={this.props.id}
                className={this.buildClassNames()}
                aria-hidden={this.props.ariaHidden}
                type={this.props.type}
                title={this.props.title}
                data-step={this.props.intro}
                data-intro={this.props.step}
                data-toggle={this.props.toggle}
                onClick={this.props.onClick}
            >
                {span}
                {this.props.content}
            </button>
        );
    }
}
