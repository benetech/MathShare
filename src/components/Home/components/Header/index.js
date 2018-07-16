import React, {Component} from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
import header from './styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom'

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
                            <img src="src/images/logo.png" alt="Benetech Math Editor" height="37"/>
                        </a>
                        <div className={bootstrap['navbar-collapse']}
                        id="navbarNav">
                            <ul className={classNames(bootstrap['navbar-nav'], bootstrap['mr-auto'])}>
                            </ul>
                            <ul className={classNames(bootstrap['navbar-nav'], header.navItem)}>
                                <li className={bootstrap['nav_item']}>
                                    <Button/>
                                </li>
                                <li className={classNames(bootstrap['nav-item'], [bootstrap.dropdown])}>
                                    <a className={classNames(bootstrap['nav-link'], bootstrap['dropdown-toggle'])} 
                                    data-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false">
                                        Problem Sets
                                    </a>
                                    <div className={bootstrap['dropdown-menu']} role="list" aria-label="Problem Sets">
                                        <a className={bootstrap['dropdown-item']}>Problem Set 01</a>
                                        <a className={bootstrap['dropdown-item']}>Problem Set 02</a>
                                        <a className={bootstrap['dropdown-item']}>Problem Set 03</a>
                                        <a className={bootstrap['dropdown-item']}>Upload</a>
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
