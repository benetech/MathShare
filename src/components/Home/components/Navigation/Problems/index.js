import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import NavigationProblem from '../Problem';
import styles from './styles.scss';
import Locales from '../../../../../strings';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../../mathlive/src/mathlive.js').default
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
        const { action } = this.props;
        const SortableItem = SortableElement(({
            problem, number, example, addNew, code, solutions,
        }) => {
            const ItemTag = (addNew ? 'div' : 'li');
            return (
                <ItemTag className={addNew && styles.newContainer}>
                    <NavigationProblem
                        solutions={solutions}
                        problem={problem}
                        number={number}
                        example={example}
                        addNew={addNew}
                        action={action}
                        code={code}
                        showRemove={this.props.editing && (!example && !addNew)}
                        activateModals={this.props.activateModals}
                        setEditProblem={this.props.setEditProblem}
                    />
                </ItemTag>
            );
        });

        const newProblem = this.props.editing
            ? <SortableItem key="item-new" addNew index={this.state.problems.length + 1} disabled /> : null;

        const SortableList = SortableContainer(({ problems, solutions }) => (
            <ol aria-labelledby="problems_in_this_set">
                {problems.sort((a, b) => {
                    if (a.position === b.position) {
                        return (a.id - b.id);
                    }
                    return (a.position - b.position);
                }).map((problem, index) => (
                    problem
                        ? <SortableItem key={`item-${index}`} index={index + 1} problem={problem} solutions={solutions} number={index} disabled={!this.props.editing} action={action} code={this.props.code} />
                        : null
                ))}
            </ol>
        ));

        return (
            <div className={`${styles.container} ${styles.problemList} justify-content-around`}>
                {this.props.children}
                {this.state.problems.length === 0 && <div className="sROnly">{Locales.strings.no_problems_added_yet}</div>}
                {this.state.problems.length > 0 && (
                    <SortableList
                        distance={5}
                        problems={this.state.problems}
                        solutions={this.props.solutions}
                        onSortEnd={this.onSortEnd}
                        onSortStart={this.onSortStart}
                        axis="xy"
                        transitionDuration={800}
                    />
                )}
                {newProblem}
            </div>

        );
    }
}
