import React from "react";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import NavigationProblem from '../Problem';

export default class Problems extends React.Component {
    render() {
        return (
            <ul className={bootstrap.row}>
               <NavigationProblem annotation="Getting Started" equation="Click here to see an example problem and learn how to use the editor" />
               <NavigationProblem annotation="Sarah works at a coffee shop. Her weekly salary is $325 and she earns 11.5% commission on sales. How much does she make if she sells $2800 in merchandise?" equation="" />
               <NavigationProblem annotation="Solve for x" equation="7x-13=1" />
            </ul>
        );
    }
}
