import {
    combineReducers,
} from 'redux';
import {
    connectRouter,
} from 'connected-react-router';
import ariaLiveAnnouncer from './ariaLiveAnnouncer/reducer';
import problem from './problem/reducer';
import problemSet from './problemSet/reducer';
import problemSetList from './problemSetList/reducer';
import routerHooks from './router/reducer';
import ui from './ui/reducer';
import userProfile from './userProfile/reducer';

export default history => combineReducers({
    router: connectRouter(history),
    ariaLiveAnnouncer,
    problem,
    problemSet,
    problemSetList,
    routerHooks,
    ui,
    userProfile,
});
