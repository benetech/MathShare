import React from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import header from './styles.css';
import Locales from '../../../../strings';

import logo from '../../../../../images/logo.png';

/*
this may be needed in future
function uploadProblemSet() {
    this.refs.fileid.click();
}

function readBlob(optStartByte, optStopByte) {

    const files = this.refs.fileid.files;
    console.log(files);
    if (!files.length) {
        NotificationManager.warning(Locales.strings.upload_no_file_warning, 'Warning');
        return;
    }

    const file = files[0];
    console.log('file:');
    console.log(file);
    const start = parseInt(optStartByte, 10) || 0;
    console.log(`start:${start}`);
    const stop = parseInt(optStopByte, 10) || file.size - 1;
    console.log(`stop:${stop}`);

    const reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
            const uploadedString = evt.target.result;
            const parsedUploadedString = JSON.parse(uploadedString);
            console.log(parsedUploadedString);
            ReadFileFinish(parsedUploadedString);
        }
    };

    const blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
} */

const MainPageHeader = (props) => {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    const SkipToContentButton = withRouter(() => (
        <a
            className={classNames('nav-link', header.pointer)}
            tabIndex={0}
            href="#LeftNavigationHeader"
        >
            {Locales.strings.go_to_main_content}
        </a>
    ));

    const GettingStartedButton = withRouter(({ history }) => (
        <a
            className={classNames('nav-link', header.pointer)}
            onClick={() => { history.push('/problem/example'); }}
            onKeyPress={() => { history.push('/problem/example'); }}
            role="link"
            tabIndex={0}
        >
            {Locales.strings.getting_started_title}
        </a>
    ));

    const shareButton = props.editing && !props.notFound
        ? (
            <a
                className={classNames('nav-link', header.pointer)}
                onClick={() => props.shareCallback(['shareSet'])}
                onKeyPress={() => props.shareCallback(['shareSet'])}
                role="button"
                tabIndex={-1}
            >
                {Locales.strings.share}
            </a>
        )
        : null;
    let link = props.editing
        ? (
            <a
                className={classNames('nav-link', header.pointer)}
                onClick={props.finishEditing}
                onKeyPress={() => props.shareCallback(['shareSet'])}
                role="link"
                tabIndex={-2}
            >
                {Locales.strings.finish_edit}
            </a>
        )
        : (
            <a
                className={classNames('nav-link', header.pointer)}
                onClick={() => {
                    props.history.push(`/problemSet/edit/${props.editCode}`);
                }}
                onKeyPress={() => props.shareCallback(['shareSet'])}
                role="link"
                tabIndex={-3}
            >
                {Locales.strings.edit_problem_set}
            </a>
        );

    if (props.notFound) {
        link = null;
    }

    const addProblemSetButton = !props.notFound ? (
        <a
            className={classNames('nav-link', header.pointer)}
            onClick={props.addProblemSetCallback}
            onKeyPress={props.addProblemSetCallback}
            role="button"
            tabIndex={-4}
        >
            {Locales.strings.add_problem_set}
        </a>
    ) : null;

    return (
        <div id="topNavigationWrapper" className={header.header}>
            <header>
                <nav
                    labeledby="topNavLabel"
                    className={classNames(header.navbar, 'navbar-expand-lg', 'navbar')}
                    id="topNavigation"
                >
                    <h1 id="topNavLabel" className="sROnly">{Locales.strings.header}</h1>
                    <a className="navbar-brand" href="#">
                        <img src={logo} alt="Benetech Math Editor" height="37" />
                    </a>
                    <div
                        className="navbar-collapse"
                        id="navbarNav"
                    >
                        <ul className={classNames('navbar-nav', 'mr-auto')} />
                        <ul className={classNames('navbar-nav', header.navItem)}>
                            <li className="nav_item">
                                <SkipToContentButton />
                            </li>
                            <li className="nav_item">
                                <GettingStartedButton />
                            </li>
                            <li className="nav_item">
                                {addProblemSetButton}
                            </li>
                            <li className="nav_item">
                                {shareButton}
                            </li>
                            <li className="nav_item">
                                {link}
                            </li>
                            {/*
                            <li className={classNames('nav-item', ['dropdown'])}>
                                <a
                                    className={classNames('nav-link', 'dropdown-toggle')}
                                    data-toggle="dropdown"
                                    href="#"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {Locales.strings.problem_sets}
                                </a>
                                <Dropdown.Menu role="list" aria-label="Problem Sets">
                                    <MenuItem onClick={() => props.changeDataSet(0)}>
                                        {Locales.strings.problem_set_1}
                                    </MenuItem>
                                    <MenuItem onClick={() => props.changeDataSet(1)}>
                                        {Locales.strings.problem_set_2}
                                    </MenuItem>
                                    <MenuItem onClick={() => props.changeDataSet(2)}>
                                        {Locales.strings.problem_set_3}
                                    </MenuItem>
                                    {
                                    <MenuItem onClick={uploadProblemSet.bind(this)}>
                                        {Locales.strings.upload}
                                    </MenuItem>
                                     } <input
                                            ref="fileid"
                                            type="file"
                                            hidden
                                            onChange={readBlob.bind(this)}
                                            />
                                </Dropdown.Menu>
                            </li>
                            */}
                            <li className="nav-item">
                                <a className="nav-link" href="mailto:info@diagramcenter.org">
                                    {Locales.strings.contact_us}
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    href="http://www.surveygizmo.com/s3/4048161/Benetech-s-Math-Editor-Online-Feedback"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="nav-link"
                                >
                                    <FontAwesome
                                        className="super-crazy-colors"
                                        name="arrow-circle-right"
                                        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                    />
                                    {Locales.strings.provide_feedback}
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
        /* eslint-enable jsx-a11y/anchor-is-valid */
    );
};

export default MainPageHeader;
