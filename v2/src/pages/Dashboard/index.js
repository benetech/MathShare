import {
    faBars, faChevronDown, faEllipsisH, faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Input, Row, Col, Radio, Dropdown, Button, Menu, Progress,
} from 'antd';
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import styles from './styles.scss';

const { Search } = Input;

const Card = ({ id }) => (
    <div id={id} key={id} className={styles.tileContainer}>
        <div className={styles.tile}>
            <div className={styles.header}>
                <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" alt="" className="img-fluid shadow-lg" />
                <span className={styles.icon}><FontAwesomeIcon icon={faEllipsisH} /></span>
            </div>
            <div className={styles.content}>
                <div className={styles.mainContent}>
                    <div className={styles.course}>Course</div>
                    <div className={styles.problemSetTitle}>Solve for X</div>
                </div>
                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        Progress
                        <span>2 of 6 Problems</span>
                    </div>
                    <div>
                        <div className="progress">
                            <Progress
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={66}
                                showInfo={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: 'grid',
        };
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    handleDropdownSelect = (e) => {
        console.log('e', e);
    }

    render() {
        const { layout } = this.state;
        const menu = (
            <Menu onClick={this.handleDropdownSelect}>
                <Menu.Item key="1">
                Most Recent
                </Menu.Item>
                <Menu.Item key="2">
                Assigned to me
                </Menu.Item>
                <Menu.Item key="3">
                Created by me
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Row
                    className={styles.topBar}
                    gutter={gutter}
                >
                    <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Search
                            className={styles.searchInput}
                            placeholder="Search set"
                            onSearch={value => console.log(value)}
                        />
                    </Col>
                </Row>
                <Row
                    className={`justify-content-between ${styles.heading}`}
                    gutter={gutter}
                >
                    <Col className={`gutter-row ${styles.topBar}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <span className={styles.title}>Your Sets</span>
                    </Col>
                    <Col className={`col-auto ${styles.setButtons}`} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div className={`btn-group ${styles.layoutBtns}`} role="group">
                            <Radio.Group
                                buttonStyle="solid"
                                onChange={this.setLayout}
                                size="large"
                                value={this.state.layout}
                                style={{ marginBottom: 8 }}
                            >
                                <Radio.Button value="line-item">
                                    <FontAwesomeIcon icon={faBars} />
                                </Radio.Button>
                                <Radio.Button value="grid">
                                    <FontAwesomeIcon icon={faThLarge} />
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className={`dropdown ${styles.dropdown}`}>
                            <Dropdown overlay={menu}>
                                <Button size="large">
                                    Most Recent
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </Button>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
                <div>
                    <div className={styles.copyLinkContainer}>
                        <span className={styles.text}>
                            Don&apos;t forget to copy the link to share your work
                        </span>
                        <Button type="primary" size="small">
                            Copy WorkLink
                        </Button>
                    </div>
                </div>
                <Row className={`${styles.problemSetGrid} ${layout}`}>
                    {[1, 2, 3].map(id => (
                        <Card id={id} key={id} />
                    ))}
                </Row>
                <div className={styles.heading}>
                    <span className={styles.title}>Example Sets</span>
                </div>
                <Row className={`${styles.problemSetGrid} ${layout}`}>
                    {[1, 2, 3].map(id => (
                        <Card id={id} key={id} />
                    ))}
                </Row>
            </div>
        );
    }
}

export default Dashboard;
