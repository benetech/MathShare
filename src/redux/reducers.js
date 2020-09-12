import {
    combineReducers,
} from 'redux';
import {
    connectRouter,
} from 'connected-react-router';
import lti from './lti/reducer';
import modal from './modal/reducer';
import problem from './problem/reducer';
import problemList from './problemList/reducer';
import routerHooks from './router/reducer';
import ui from './ui/reducer';
import userProfile from './userProfile/reducer';
import ariaLiveAnnouncer from './ariaLiveAnnouncer/reducer';
import tts from './tts/reducer';

export default history => combineReducers({
    router: connectRouter(history),
    modal,
    ariaLiveAnnouncer,
    lti,
    problem,
    problemList,
    routerHooks,
    tts,
    ui,
    userProfile,
});
