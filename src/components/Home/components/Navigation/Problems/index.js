import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import NavigationProblem from '../Problem';
import styles from './styles.css';

const mathLive = DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../lib/mathlivedist/mathlive.js');

export default class Problems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: [],
        };

        this.onSortEnd = this.onSortEnd.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({ problems: newProps.problems });
    }

    onSortEnd({ oldIndex, newIndex }) {
        this.props.updatePositions(arrayMove(this.state.problems, oldIndex - 1, newIndex - 1));
    }

    onSortStart = () => {
        mathLive.renderMathInDocument();
    }

    render() {
        const SortableItem = SortableElement(({
            problem, number, example, addNew,
        }) => (
            <div>
                <NavigationProblem
                    problem={problem}
                    number={number}
                    example={example}
                    addNew={addNew}
                    showRemove={this.props.editing && (!example && !addNew)}
                    activateModals={this.props.activateModals}
                />
            </div>
        ));

        const exampleProblem = <SortableItem key="item-example" example index={0} disabled />;

        const newProblem = this.props.editing
            ? <SortableItem key="item-new" addNew index={this.state.problems.length + 1} disabled /> : null;

        const SortableList = SortableContainer(({ problems }) => (
            <div className={styles.container}>
                {exampleProblem}
                {problems.map((problem, index) => (
                    problem
                        ? <SortableItem key={`item-${index}`} index={index + 1} problem={problem} number={index} disabled={!this.props.editing} />
                        : null
                ))}
                {newProblem}
            </div>
        ));

        return (
            <SortableList
                distance={5}
                problems={this.state.problems}
                onSortEnd={this.onSortEnd}
                onSortStart={this.onSortStart}
                axis="xy"
                transitionDuration={800}
            />
        );
    }
}
