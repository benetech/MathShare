/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import styles from './styles.scss';

const Card = ({ id }) => (
    <div id={id} key={id} className={styles.tileContainer}>
        <div className={styles.tile}>
            <div className={styles.header}>
                <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" alt="" className="img-fluid shadow-lg" />
                <i className="fa fa-ellipsis-h" aria-hidden="true" />
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
                            <div className="progress-bar bg-dark" role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100" style={{ width: '33%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: 'grid',
        };
    }

    setLayout = (layout) => {
        this.setState({
            layout,
        });
    }

    render() {
        const { layout } = this.state;
        return (
            <div>
                <div className={`row ${styles.topBar}`}>
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className={`${styles.searchInput} input-group input-group-alternative mb-4`}>
                                <input className="form-control form-control-alternative" placeholder="Search set" type="text" />
                                <div className="input-group-append">
                                    <span className="input-group-text">
                                        <i className="fa fa-search" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`row justify-content-between ${styles.heading}`}>
                    <div className="col col-md-6 col-sm-12">
                        <span className={styles.title}>Your Sets</span>
                    </div>
                    <div className={`col-auto align-self-end ${styles.setButtons}`}>
                        <button type="button" className={`btn btn-secondary ${styles.newSetBtn}`}>
                            <i className="fa fa-plus-circle" aria-hidden="true" />
                            New Set
                        </button>
                        <div className={`btn-group ${styles.layoutBtns}`} role="group">
                            <button type="button" className={`btn btn-outline-default ${(layout === 'line-item') ? 'active' : ''}`} onClick={() => { this.setLayout('line-item'); }}>
                                <i className="fa fa-bars" aria-hidden="true" />
                            </button>
                            <button type="button" className={`btn btn-outline-default ${(layout === 'grid') ? 'active' : ''}`} onClick={() => { this.setLayout('grid'); }}>
                                <i className="fa fa-th-large" aria-hidden="true" />
                            </button>
                        </div>
                        <div className={`dropdown ${styles.dropdown}`}>
                            <button className="btn btn-outline-default btn-icon btn-round" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Most Recent
                                <i className="fa fa-chevron-down" aria-hidden="true" />
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" href="#">Most Recent</a>
                                <a className="dropdown-item" href="#">Assigned to me</a>
                                <a className="dropdown-item" href="#">Created by me</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`row ${styles.problemSetGrid} ${layout}`}>
                    {[1, 2, 3].map(id => (
                        <Card id={id} key={id} />
                    ))}
                </div>
                <div className={`row ${styles.heading}`}>
                    <span className={styles.title}>Example Sets</span>
                </div>
                <div className={`row ${styles.problemSetGrid} ${layout}`}>
                    {[1, 2, 3].map(id => (
                        <Card id={id} key={id} />
                    ))}
                </div>
            </div>
        );
    }
}

export default Dashboard;
