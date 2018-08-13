import React, { Component } from 'react'
import MainPageHeader from './components/Header';
import NavigationHeader from './components/Navigation/Header';
import NavigationProblems from './components/Navigation/Problems';
import MainPageFooter from './components/Footer';
import home from './styles.css';
import { NotificationContainer } from 'react-notifications';
import exampleProblem from '../../data/example01.json'; //TODO: Add example problem to the UI
import createAlert from '../../scripts/alert';
import Locales from '../../strings'
import config from '../../../package.json';
import axios from 'axios';
import _ from 'lodash';

export default class Home extends Component {
    componentDidMount() {
        if (this.props.saved) {
            createAlert('success', Locales.strings.problem_saved_success_message, 'Success');
            this.props.dialogDisplayed();
        }
        if (this.props.problems.length == 0) {
        axios.get(`${config.serverUrl}/set/view/${this.props.match.params.code}`)
            .then(response => {
                response.data.problems.forEach(function (problem, i) {
                    _.assign(problem, { id: i });
                });
                this.props.setData(response.data);
            });
        }
    }

    render() {
        return (
            <div className={home.mainWrapper}>
                <NotificationContainer />
                <MainPageHeader changeDataSet={id => this.props.changeDataSet(id)} />
                <div className={home.contentWrapper} id="ContentWrapper">
                    <nav id="LeftNavigation" className={home.leftNavigation} aria-labelledby="LeftNavigationHeader">
                        <NavigationHeader />
                        <NavigationProblems problems={this.props.problems} createNewSolution={this.props.createNewSolution} />
                    </nav>
                </div>
                <MainPageFooter />
            </div>
        )
    }
}
