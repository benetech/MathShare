import React, { Component } from "react";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import NavigationProblem from '../Problem';
import { Link } from 'react-router-dom'

export default class Problems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problems: props.dataSet.problems
        };
    }

    render() {
        const problems = this.state.problems.map((problem, i) =>
            <Link to={`/problem/${problem.metadata.id}`} key={problem.metadata.id}>
                <NavigationProblem key={i} problem={problem} number={i} />
            </Link>
        );

        return (
            <ul className={bootstrap.row}>
                <Link to={`/problem/example`} key="example">
                    <NavigationProblem example />
                </Link>
                {problems}
            </ul>
        );
    }
}
