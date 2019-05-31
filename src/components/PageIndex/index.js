import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestDefaultRevision } from '../../redux/problemList/actions';

class Index extends Component {
    componentDidMount() {
        this.props.requestDefaultRevision();
    }

    render() {
        return (
            <div />
        );
    }
}

export default connect(
    () => ({}),
    { requestDefaultRevision },
)(Index);
