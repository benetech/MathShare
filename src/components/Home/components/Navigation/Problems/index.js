import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import NavigationProblem from '../Problem';
import styles from './styles.css';
import Locales from '../../../../../strings';

const mathLive = DEBUG_MODE ? require('../../../../../../../mathlive/src/mathlive.js').default
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
        this.setState({
            problems: newProps.problems,
        });
    }

    onSortEnd({ oldIndex, newIndex }) {
        this.props.updatePositions(arrayMove(this.state.problems, oldIndex - 1, newIndex - 1));
    }

    onSortStart = () => {
        mathLive.renderMathInDocument();
    }

    render() {
        const SortableItem = SortableElement(({
            problem, number, example, addNew, action, code,
        }) => (
            <li>
                <NavigationProblem
                    problem={problem}
                    number={number}
                    example={example}
                    addNew={addNew}
                    action={action}
                    code={code}
                    showRemove={this.props.editing && (!example && !addNew)}
                    activateModals={this.props.activateModals}
                />
            </li>
        ));

        const newProblem = this.props.editing
            ? <SortableItem key="item-new" addNew index={this.state.problems.length + 1} disabled /> : null;

        const SortableList = SortableContainer(({ problems, solutions }) => (
            <div className={styles.container}>
                <ol className={`justify-content-around ${styles.problemList}`} aria-label={Locales.strings.problems}>
                    {problems.map((problem, index) => (
                        problem
                            ? <SortableItem key={`item-${index}`} index={index + 1} problem={problem} solutions={solutions} number={index} disabled={!this.props.editing} action={this.props.action} code={this.props.code} />
                            : null
                    ))}
                    {newProblem}
                </ol>
            </div>
        ));

        return (
            <SortableList
                distance={5}
                problems={this.state.problems}
                solutions={this.state.solutions}
                onSortEnd={this.onSortEnd}
                onSortStart={this.onSortStart}
                axis="xy"
                transitionDuration={800}
            />
        );
    }
}
