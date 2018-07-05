import React from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import header from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MainPageHeader extends React.Component {
    render() {
        return (
            <div id="topNavigationWrapper" className={header.header} role="heading" aria-level="1">
                <header>
                    <h2 className={styles.sROnly}> Header </h2>            
                    <nav  className={
                        classNames({
                                [header.navbar]: true,
                                [bootstrap['navbar-expand-lg']]: true,
                                [bootstrap.navbar]: true
                            })
                        } 
                        id="topNavigation">
                        <a className={bootstrap['navbar-brand']} href="#">
                            <img src="images/logo.png" alt="Benetech Math Editor" height="37"/>
                        </a>
                        <div className={bootstrap['navbar-collapse']}
                        id="navbarNav">
                            <ul className={
                                classNames({
                                    [bootstrap['navbar-nav']]: true,
                                    [bootstrap['mr-auto']]: true
                                })
                            }>
                            </ul>
                            <ul className={
                                classNames({
                                    [bootstrap['navbar-nav']]: true,
                                    [header.navItem]: true
                                })
                            }>
                                <li className={bootstrap['nav_item']}>
                                    <a className={
                                        classNames({
                                            [bootstrap['nav-link']]: true,
                                            [header.pointer]: true
                                        })
                                    }>Getting Started</a>
                                </li>
                                <li className={
                                        classNames({
                                            [bootstrap['nav-item']]: true,
                                            [bootstrap.dropdown]: true
                                        })
                                    }>
                                    <a className={
                                        classNames({
                                            [bootstrap['nav-link']]: true,
                                            [bootstrap['dropdown-toggle']]: true
                                        })
                                    }
                                    data-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false">Problem Sets</a>
                                    <div className={bootstrap['dropdown-menu']} role="list" aria-label="Problem Sets">
                                        <a className={bootstrap['dropdown-menu']}>Problem Set 01</a>
                                        <a className={bootstrap['dropdown-menu']}>Problem Set 02</a>
                                        <a className={bootstrap['dropdown-menu']}>Problem Set 03</a>
                                        <a className={bootstrap['dropdown-menu']}>Upload</a>
                                        <input id='fileid' type='file' hidden/>
                                    </div>
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
