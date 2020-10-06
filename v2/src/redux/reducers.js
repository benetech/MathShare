import {
    combineReducers,
} from 'redux';
import {
    connectRouter,
} from 'connected-react-router';
import routerHooks from './router/reducer';
import ui from './ui/reducer';
import userProfile from './userProfile/reducer';
import problemSetList from './problemSetList/reducer';
import ariaLiveAnnouncer from './ariaLiveAnnouncer/reducer';

export default history => combineReducers({
    router: connectRouter(history),
    ariaLiveAnnouncer,
    problemSetList,
    routerHooks,
    ui,
    userProfile,
});
