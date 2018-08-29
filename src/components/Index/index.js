import React, { Component } from "react";
import config from '../../../package.json';
import axios from 'axios';

export default class Index extends Component {
    componentDidMount() {
        axios.get(`${config.serverUrl}/problemSet/defaultRevision`)
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
