import React, { Component } from "react";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import NavigationProblem from '../Problem';

export default class Problems extends Component {
    render() {
        const problems = this.props.problems.map((problem, i) => {
            return problem.text !== '' ?
                <NavigationProblem key={i} problem={problem} number={i} createNewSolution={this.props.createNewSolution}  />
                : null
            }
        );

        return (
            <ul className={bootstrap.row}>
                    <NavigationProblem example id='example' createNewSolution={this.props.createNewSolution} />
                {problems}
            </ul>
        );
    }
}
