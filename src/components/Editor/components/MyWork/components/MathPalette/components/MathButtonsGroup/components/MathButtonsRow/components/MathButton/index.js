import React, { Component } from "react";
import Button from '../../.././../../../../../../../../Button';
import classNames from "classnames";
import mathButton from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MathButton extends Component {
    buildButtonTitle() {
        var title = this.props.button.title;
        var keys = this.props.button.keys;
        var keyShortcut = "";
        if (keys) {
            keyShortcut += " (⌨: ";
            keyShortcut += keys.join("+");
            keyShortcut += ")";
        }
        return title + keyShortcut;
    }

    buildClassNames() {
        var commonClasses = this.props.palette.commonClass;
        var additionalClasses = this.props.button.additionalClass;
        if (!commonClasses) {
            commonClasses = "";
        }
        if (!additionalClasses) {
            additionalClasses = "";
        }
        var classes = commonClasses.split(" ").concat(additionalClasses.split(" "));
        var result = [];
        classes.forEach(function (clazz) {
            result.push(mathButton[clazz]);
        });
        return classNames(bootstrap.btn, result);
    }

    render() {
        //TODO var onClick = concatAttribute(this.props.commonOnclick, this.props.additionalOnclick);
        const title = this.buildButtonTitle();

        return (
            <span role="listitem">
                <Button
                    id={this.props.id}
                    className={this.buildClassNames()}
                    data-toggle="tooltip"
                    title={title}
                    content={this.props.button.value}
                //TODO onclick={onClick}
                />
                <span className="sr-only">{title}</span>
            </span>
        );
    }
}
