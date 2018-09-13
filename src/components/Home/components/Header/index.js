import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import header from './styles.css';
import { withRouter } from 'react-router-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import Locales from '../../../../strings';

export default class MainPageHeader extends Component {
    render() {
        const GettingStartedButton = withRouter(({ history }) => (
            <a className={classNames('nav-link', header.pointer)} onClick={() => { history.push('/problem/example') }}>
                {Locales.strings.getting_started_title}
            </a>
        ))

        const shareButton = this.props.editing ? 
        <a className={classNames('nav-link', header.pointer)} onClick={() => this.props.shareCallback(["shareSet"])}>
            {Locales.strings.share}
        </a>
        : 
        null
        const button = this.props.editing ? 
            <a className={classNames('nav-link', header.pointer)} onClick={this.props.finishEditing}>
                {Locales.strings.finish_edit}
            </a>
            : 
            <a className={classNames('nav-link', header.pointer)} onClick={() => { 
                    this.props.history.push(`/problemSet/edit/${this.props.editCode}`);
                }}>
                {Locales.strings.edit}
            </a>

         const addProblemSetButton = <a className={classNames('nav-link', header.pointer)} onClick={this.props.addProblemSetCallback}>
             {Locales.strings.add_problem_set}
         </a>

        return (
            <div id="topNavigationWrapper" className={header.header} role="heading" aria-level="1">
                <header>
                    <h2 className={'sROnly'}>{Locales.strings.header}</h2>
                    <nav className={classNames(header.navbar, 'navbar-expand-lg', 'navbar')}
                        id="topNavigation">
                        <a className={'navbar-brand'} href="#">
                            <img src="/src/images/logo.png" alt="Benetech Math Editor" height="37" />
                        </a>
                        <div className={'navbar-collapse'}
                            id="navbarNav">
                            <ul className={classNames('navbar-nav', 'mr-auto')}>
                            </ul>
                            <ul className={classNames('navbar-nav', header.navItem)}>
                                <li className={'nav_item'}>
                                    <GettingStartedButton />
                                </li>
                                <li className={'nav_item'}>
                                    {addProblemSetButton}
                                </li>
                                <li className={'nav_item'}>
                                    {shareButton}
                                </li>
                                <li className={'nav_item'}>
                                    {button}
                                </li>
                                <li className={classNames('nav-item', ['dropdown'])}>
                                    <a className={classNames('nav-link', 'dropdown-toggle')}
                                        data-toggle="dropdown" href="#" role="button"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        {Locales.strings.problem_sets}
                                    </a>
                                    <Dropdown.Menu role="list" aria-label="Problem Sets">
                                        <MenuItem onClick={e => this.props.changeDataSet(0)}>{Locales.strings.problem_set_1}</MenuItem>
                                        <MenuItem onClick={e => this.props.changeDataSet(1)}>{Locales.strings.problem_set_2}</MenuItem>
                                        <MenuItem onClick={e => this.props.changeDataSet(2)}>{Locales.strings.problem_set_3}</MenuItem>
                                        <MenuItem onClick={uploadProblemSet.bind(this)}>{Locales.strings.upload}</MenuItem>
                                        <input ref='fileid' type='file' hidden onChange={readBlob.bind(this)} />
                                    </Dropdown.Menu>
                                </li>
                                <li className={'nav-item'}>
                                    <a className={'nav-link'} href="mailto:info@diagramcenter.org">{Locales.strings.contact_us}</a>
                                </li>
                                <li className={'nav-item'}>
                                    <a href="http://www.surveygizmo.com/s3/4048161/Benetech-s-Math-Editor-Online-Feedback"
                                        target="_blank"
                                        className={'nav-link'}>
                                        <FontAwesome
                                            className='super-crazy-colors'
                                            name='arrow-circle-right'
                                            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                        />
                                        &nbsp;{Locales.strings.provide_feedback}
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
        NotificationManager.warning(Locales.strings.upload_no_file_warning, 'Warning');
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
