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

export default history => combineReducers({
    router: connectRouter(history),
    modal,
    problem,
    problemList,
    routerHooks,
});
