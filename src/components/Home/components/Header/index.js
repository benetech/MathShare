import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import header from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

export default class MainPageHeader extends Component {
    render() {
        const Button = withRouter(({ history }) => (
            <a className={classNames(bootstrap['nav-link'], header.pointer)} onClick={() => { history.push('/problem/example') }}>
                Getting Started
            </a>
        ))

        return (
            <div id="topNavigationWrapper" className={header.header} role="heading" aria-level="1">
                <header>
                    <h2 className={styles.sROnly}> Header </h2>
                    <nav className={classNames(header.navbar, bootstrap['navbar-expand-lg'], bootstrap.navbar)}
                        id="topNavigation">
                        <a className={bootstrap['navbar-brand']} href="#">
                            <img src="/src/images/logo.png" alt="Benetech Math Editor" height="37" />
                        </a>
                        <div className={bootstrap['navbar-collapse']}
                            id="navbarNav">
                            <ul className={classNames(bootstrap['navbar-nav'], bootstrap['mr-auto'])}>
                            </ul>
                            <ul className={classNames(bootstrap['navbar-nav'], header.navItem)}>
                                <li className={bootstrap['nav_item']}>
                                    <Button />
                                </li>
                                <li className={classNames(bootstrap['nav-item'], [bootstrap.dropdown])}>
                                    <a className={classNames(bootstrap['nav-link'], bootstrap['dropdown-toggle'])}
                                        data-toggle="dropdown" href="#" role="button"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        Problem Sets
                                    </a>
                                    <Dropdown.Menu role="list" aria-label="Problem Sets">
                                        <MenuItem onClick={e => this.props.changeDataSet(0)}>Problem Set 01</MenuItem>
                                        <MenuItem onClick={e => this.props.changeDataSet(1)}>Problem Set 02</MenuItem>
                                        <MenuItem onClick={e => this.props.changeDataSet(2)}>Problem Set 03</MenuItem>
                                        <MenuItem onClick={uploadProblemSet.bind(this)}>Upload</MenuItem>
                                        <input ref='fileid' type='file' hidden onChange={readBlob.bind(this)} />
                                    </Dropdown.Menu>
                                </li>
                                <li className={bootstrap['nav-item']}>
                                    <a className={bootstrap['nav-link']} href="mailto:info@diagramcenter.org">Contact Us</a>
                                </li>
                                <li className={bootstrap['nav-item']}>
                                    <a href="http://www.surveygizmo.com/s3/4048161/Benetech-s-Math-Editor-Online-Feedback"
                                        target="_blank"
                                        className={bootstrap['nav-link']}>
                                        <FontAwesome
                                            className='super-crazy-colors'
                                            name='arrow-circle-right'
                                            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                        />
                                        &nbsp;Provide Feedback
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
        );
    }
}

function uploadProblemSet() {
    this.refs.fileid.click();
}

function readBlob(opt_startByte, opt_stopByte) {
    var files = this.refs.fileid.files;
    console.log(files);
    if (!files.length) {
        NotificationManager.warning('Please select a file', 'Warning');
        return;
    }

    var file = files[0];
    console.log('file:');
    console.log(file);
    var start = parseInt(opt_startByte) || 0;
    console.log('start:' + start);
    var stop = parseInt(opt_stopByte) || file.size - 1;
    console.log('stop:' + stop);

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            var uploadedString = evt.target.result;
            var parsedUploadedString = JSON.parse(uploadedString);
            console.log(parsedUploadedString);
            ReadFileFinish(parsedUploadedString);
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}
