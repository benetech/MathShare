import { Component } from 'preact';
import Header from './header';
import Home from '../routes/home';
import NotFound from '../routes/404';
import Profile from '../routes/profile';
import { Router } from 'preact-router';

// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
    handleRoute = e => {
        this.setState({
            currentUrl: e.url
        });
    };

    render() {
        return (
            <div id="app">
                <Header selectedRoute={this.state.currentUrl} />
                <Router onChange={this.handleRoute}>
                    <Home path="/" />
                    <Profile path="/profile/" user="me" />
                    <Profile path="/profile/:user" />
                    <NotFound default />
                </Router>
            </div>
        );
    }
}
