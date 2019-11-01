import {
    combineReducers,
} from 'redux';
import {
    connectRouter,
} from 'connected-react-router';
import modal from './modal/reducer';
import problem from './problem/reducer';
import problemList from './problemList/reducer';
import routerHooks from './router/reducer';
import userProfile from './userProfile/reducer';
import ariaLiveAnnouncer from './ariaLiveAnnouncer/reducer';

export default history => combineReducers({
    router: connectRouter(history),
    modal,
    ariaLiveAnnouncer,
    problem,
    problemList,
    routerHooks,
    userProfile,
});
