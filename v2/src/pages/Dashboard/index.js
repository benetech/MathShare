import {
    faBars, faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Row, Col, Radio,
} from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Card from '../../components/Card';
import problemSetListActions from '../../redux/problemSetList/actions';
import styles from './styles.scss';
import CopyLink from '../../components/CopyLink';
import Select from '../../components/Select';
import TopBar from '../../components/TopBar';

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

    componentDidMount() {
        this.props.requestExampleSets();
    }

    setLayout = (e) => {
        this.setState({
            layout: e.target.value,
        });
    }

    handleDropdownSelect = (e) => {
        console.log('e', e);
    }

    renderExampleSets() {
        const { layout } = this.state;
        const { problemSetList } = this.props;
        if (problemSetList.exampleProblemSets.loading) {
            return null;
        }
        return (
            <>
                <div className={styles.heading}>
                    <span className={styles.title}>Example Sets</span>
                </div>
                <Row className={`${styles.problemSetGrid} ${layout}`}>
                    {problemSetList.exampleProblemSets.data.map(exampleSet => (
                        <Card key={exampleSet.id} {...exampleSet} isExampleSet />
                    ))}
                </Row>
            </>
        );
    }

    render() {
        const { layout } = this.state;
        const options = [
            {
                value: 'most_recent',
                label: 'Most Recent',
            },
            {
                value: 'assigned_to_me',
                label: 'Assigned to Me',
            },
            {
                value: 'Created by me',
                label: 'Created by Me',
            },
        ];

        return (
            <div>
                <TopBar />
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
                        <Select dropdownClassName={styles.select} options={options} size="large" defaultValue="most_recent" />
                    </Col>
                </Row>
                <Row>
                    <CopyLink />
                </Row>
                <Row className={`${styles.problemSetGrid} ${layout}`}>
                    {[1, 2, 3].map(id => (
                        <Card id={id} key={id} />
                    ))}
                </Row>
                {this.renderExampleSets()}
            </div>
        );
    }
}

export default connect(
    state => ({
        problemSetList: state.problemSetList,
        userProfile: state.userProfile,
        routerHooks: state.routerHooks,
        router: state.router,
    }),
    {
        ...problemSetListActions,
    },
)(Dashboard);
