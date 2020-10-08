/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import {
    faBars, faThLarge, // faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Row, Col, Radio, // Menu, Dropdown, Button, ,
} from 'antd';
import React, { Component } from 'react';
import Card from '../../components/Card';
import styles from './styles.scss';

const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 24,
};

class Welcome extends Component {
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
        // const menu = (
        //     <Menu onClick={this.handleDropdownSelect}>
        //         <Menu.Item key="1">
        //             Most Recent
        //         </Menu.Item>
        //         <Menu.Item key="2">
        //             Assigned to me
        //         </Menu.Item>
        //         <Menu.Item key="3">
        //             Created by me
        //         </Menu.Item>
        //     </Menu>
        // );

        return (
            <div>
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
                        {/* <div className={`dropdown ${styles.dropdown}`}>
                            <Dropdown overlay={menu}>
                                <Button size="large">
                                    Most Recent
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </Button>
                            </Dropdown>
                        </div> */}
                    </Col>
                </Row>
                <Row className={`${styles.problemSetGrid} grid`}>
                    <Card history={this.props.history} newSet />
                </Row>
            </div>
        );
    }
}

export default Welcome;
