import React, { Component } from "react";
import classNames from "classnames";
import editorButtons from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import MyWorkFooter from './components/MyWorkFooter';
import InputContainerSelectors from './components/InputContainerSelectors';
import Locales from '../../../../../../strings';

export default class MyWorkEditorButtons extends Component {
    constructor(props) {
        super(props);

        this.addStep = this.addStep.bind(this);
    }

    componentDidMount() {
        $('#undoAction').hide();
    }

    addStep() {
        this.props.addStepCallback();
        if (this.props.textAreaValue != "") {
            this.props.clearAndResizeScratchPad();
        }
    }

    render() {
        const addLabel = this.props.addingProblem ? Locales.strings.add_problem : Locales.strings.add_step;
        return (
            <div
                id="editorButtons"
                className={
                    classNames(
                        bootstrap['d-flex'],
                        bootstrap['flex-row'],
                        bootstrap['flex-nowrap'],
                        bootstrap['justify-content-between'],
                        editorButtons.editorButtons
                    )
                }
            >
            <InputContainerSelectors
                openScratchpad={this.props.openScratchpad}
                hideScratchpad={this.props.hideScratchpad}
                openSymbols={this.props.openScratchpad}
                scratchpadMode={this.props.scratchpadMode} />
            <MyWorkFooter
                deleteStepsCallback={this.props.deleteStepsCallback}
                hide={this.props.editing}
                history={this.props.history}
                solution={this.props.solution}
                addingProblem={this.props.addingProblem}
                cancelCallback={this.props.cancelCallback}
                saveCallback={this.props.saveCallback}
                addLabel={addLabel}
                addStep={this.addStep}
                undoButton={true}
                undoLastActionCallback={this.props.undoLastActionCallback}
                cancelEditCallback={this.props.cancelEditCallback}
                updateCallback={this.props.updateCallback}
                editing={this.props.editing}
                editingProblem={this.props.editingProblem} />
            </div>
        );
    }
}
