/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
import React from 'react';
import styles from './styles.scss';

const Welcome = ({ history }) => (
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
            <div className="col col-md-6 col-sm-12 col-xs-12">
                <span className={styles.title}>Your Sets</span>
            </div>
            <div className={`col-auto align-self-end ${styles.setButtons}`}>
                <button
                    type="button"
                    className={`btn btn-secondary ${styles.newSetBtn}`}
                >
                    <i className="fa fa-plus-circle" aria-hidden="true" />
                    New Set
                </button>
                <div className={`btn-group ${styles.layoutBtns}`} role="group">
                    <button type="button" className="btn btn-outline-default active">
                        <i className="fa fa-bars" aria-hidden="true" />
                    </button>
                    <button type="button" className="btn btn-outline-default">
                        <i className="fa fa-th-large" aria-hidden="true" />
                    </button>
                </div>
                <div className={`dropdown ${styles.dropdown}`}>
                    <button className="btn btn-outline-default btn-icon btn-round" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        recent
                        <i className="fa fa-chevron-down" aria-hidden="true" />
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">recent</a>
                    </div>
                </div>
            </div>
        </div>
        <div className={`row ${styles.problemSetGrid}`}>
            <div
                className="col-lg-4 col-md-6"
                onClick={() => {
                    console.log('history');
                    history.push('/dash');
                }}
            >
                <div className={`${styles.tile} ${styles.newSet}`}>
                    <div>
                        <div>
                            <i className="fa fa-plus-circle" aria-hidden="true" />
                        </div>
                        <div>
                            Add your first problem here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Welcome;
