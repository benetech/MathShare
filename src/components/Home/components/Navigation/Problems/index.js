import React, { Component } from "react";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import NavigationProblem from '../Problem';

export default class Problems extends Component {
    render() {
        const problems = this.props.problems.map((problem, i) => {
            return problem.metadata.id !== 'example' ?
            <NavigationProblem key={i} problem={problem.originalProblem} number={i} id={problem.metadata.id}/>
            : null}
        );

        return (
            <ul className={bootstrap.row}>
                    <NavigationProblem example id='example'/>
                {problems}
            </ul>
        );
    }
}
