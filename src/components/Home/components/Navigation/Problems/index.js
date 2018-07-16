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
            <NavigationProblem key={i} problem={problem} number={i} id={problem.metadata.id}/>
        );

        return (
            <ul className={bootstrap.row}>
                    <NavigationProblem example id='example1'/>
                {problems}
            </ul>
        );
    }
}
