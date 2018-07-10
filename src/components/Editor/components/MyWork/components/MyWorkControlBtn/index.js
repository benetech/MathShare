import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import buttons from '../../../../../../styles/buttons.css';

export default class MyWorkControlBtn extends Component {
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
                className={
                    classNames(
                        this.props.className,
                        { [buttons.withRightMargin]: this.props.withRightMargin }
                    )
                }
                title={this.props.title}
                data-step={this.props.intro}
                data-intro={this.props.step}
                data-toggle={this.props.toggle}
            //TODO onclick="GoogleAnalytics('Save');"
            >
                {span}
                {this.props.content}
            </button>
        );
    }
}
