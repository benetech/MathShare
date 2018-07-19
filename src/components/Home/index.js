import React, { Component } from 'react'
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import home from './styles.css';
import { NotificationContainer } from 'react-notifications';

export default class Home extends Component {
    render() {
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer/>
                <MainPageHeader changeDataSet={id => this.props.changeDataSet(id)} />
                <div className={home.contentWrapper} id="ContentWrapper">
                    <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                        <NavigationHeader />
                        <NavigationProblems problems={this.props.problems} />
                    </nav>
                </div>
                <MainPageFooter />
            </div>
        )
    }
}
