import React, { Component } from "react";
import config from '../../../package.json';
import axios from 'axios';

export default class Index extends Component {
    componentDidMount() {
        axios.get(`${config.serverUrl}/set/default`)
            .then(response => {
                this.props.history.push(`/set/${response.data}`);
            });
    }
    
    render() {
        return (
            <div></div>
        );
    }
}
