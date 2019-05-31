import {
    combineReducers,
} from 'redux';
import {
    connectRouter,
} from 'connected-react-router';
import problemList from './problemList/reducer';

export default history => combineReducers({
    router: connectRouter(history),
    problemList,
});
