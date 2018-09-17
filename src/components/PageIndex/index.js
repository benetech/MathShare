import React, { Component } from "react";
import axios from 'axios';
import { SERVER_URL } from '../../config';

export default class Index extends Component {
    componentDidMount() {
        axios.get(`${SERVER_URL}/problemSet/defaultRevision`)
            .then(response => {
                this.props.history.push(`/problemSet/view/${response.data}`);
        });
    }
    
    render() {
        return (
            <div></div>
        );
    }
}
