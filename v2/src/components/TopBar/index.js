import React, { Component } from 'react';
import {
    Col, Input, Row,
} from 'antd';
import styles from './styles.scss';

const { Search } = Input;

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class TopBar extends Component {
    handleChange = (value) => {
        console.log('value', value);
    }

    render() {
        return (
            <Row
                className={styles.topBar}
                gutter={gutter}
                justify="space-between"
                align="bottom"
            >
                <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Search
                        className={styles.searchInput}
                        placeholder="Search sets."
                        onSearch={this.handleChange}
                    />
                </Col>
            </Row>
        );
    }
}

export default TopBar;
