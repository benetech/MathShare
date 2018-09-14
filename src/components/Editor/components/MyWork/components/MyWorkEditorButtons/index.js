
import React, { Component } from "react";
import classNames from "classnames";
import editorButtons from './styles.css';
import MyWorkFooter from './components/MyWorkFooter';
import InputContainerSelectors from './components/InputContainerSelectors';
import Locales from '../../../../../../strings';

export default class MyWorkEditorButtons extends Component {
    render() {
        const addLabel = this.props.addingProblem ? Locales.strings.add_problem : Locales.strings.add_step;
        return (
            <div
                id="editorButtons"
                className={classNames(
                        'd-flex',
                        'flex-row',
                        'flex-nowrap',
                        'justify-content-between',
                        editorButtons.editorButtons
                    )
                }
            >
            <InputContainerSelectors {...this.props} />
            <MyWorkFooter {...this.props} addLabel={addLabel} />
            </div>
        );
    }
}
