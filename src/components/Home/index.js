import React from 'react'
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import home from './styles.css';

const Home = (props) => (
    <div className={home.mainWrapper}>
        {/*<div class="alertContainer"></div> I guess we don't need this anymore?  */}
        <MainPageHeader/>
        <div className={home.contentWrapper} id="ContentWrapper">
            <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                <NavigationHeader />
                <NavigationProblems dataSet={props.dataSet} />
            </nav>
        </div>
        <MainPageFooter/>
    </div>
)

export default Home
