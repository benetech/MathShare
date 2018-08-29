import React, { Component } from "react";
import config from '../../../package.json';
import axios from 'axios';

export default class Index extends Component {
    componentDidMount() {
        axios.get(`${config.serverUrl}/problemSet/default`)
            .then(editResponse => {
                axios.get(`${config.serverUrl}/problemSet/defaultRevision`).then(shareResponse => {
                    this.props.history.push(`/problemSet/${editResponse.data}/revision/${shareResponse.data}`);
                })
            });
    }
    
    render() {
        return (
            <div></div>
        );
    }
}
