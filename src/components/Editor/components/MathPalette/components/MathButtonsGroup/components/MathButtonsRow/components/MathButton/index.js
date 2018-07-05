import React from "react";
import classNames from "classnames";
import mathButton from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MathButton extends React.Component {
    render() {
        //TODO var onClick = concatAttribute(this.props.commonOnclick, this.props.additionalOnclick);
        var title = buildButtonTitle(this.props.button.title, this.props.button.keys);

        return (
            <span role="listitem">
                <button id={this.props.id}
                    className={classNames(bootstrap.btn, buildClassNames(this.props.palette.commonClass, this.props.button.additionalClass))}
                    data-toggle="tooltip"
                    title={title}
                //TODO onclick={onClick}
                >{this.props.button.value}</button>
                <span className="sr-only">{title}</span>
            </span>
        );
    }
}

function buildButtonTitle(title, keys) {
    var keyShortcut = "";
    if (keys) {
        keyShortcut += " (⌨: ";
        keyShortcut += keys.join("+");
        keyShortcut += ")";
    }
    return title + keyShortcut;
}

function buildClassNames(commonClasses, additionalClasses) {
    if (!commonClasses) {
        commonClasses = "";
    }
    if (!additionalClasses) {
        additionalClasses = "";
    }
    var classes = commonClasses.split(" ").concat(additionalClasses.split(" "));
    var result = [];
    classes.forEach(function(clazz) {
        result.push(mathButton[clazz]);
    });
    return result;
}
