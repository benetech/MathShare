import React, {Component} from "react";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import NavigationProblem from '../Problem';
import { Link } from 'react-router-dom'
import ProblemApi from '../../../../../api'


export default class Problems extends Component {
    render() {
        return (
            <ul className={bootstrap.row}>
                {ProblemApi.all().map(p => (
                    <Link to={`/problem/${p.number}`} key={p.number}>
                        <NavigationProblem annotation={`${p.annotation}`} equation={`${p.equation}`}/>
                    </Link>
                ))}
            </ul>
        );
    }
}
