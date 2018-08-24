import React, { Component } from "react";
import config from '../../../package.json';
import axios from 'axios';

export default class Index extends Component {
    componentDidMount() {
        axios.get(`${config.serverUrl}/set/defaultRevision`)
            .then(response => {
                this.props.history.push(`/set/view/${response.data}`);
            });
    }
    
    render() {
        return (
            <div></div>
        );
    }
}
