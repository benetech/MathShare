import {
    createMatchSelector,
} from 'connected-react-router';

export const getState = state => state.router;

export const getRouterHookState = state => state.routerHooks;

// const routes = {
//     path: [
//         '/app/problemSet/:action',
//         '/app/problemSet/:action/:code',
//         '/app/problem/:action/:code',
//         '/app/problem/example',
//         '/app',
//     ],
// };


export const matchCurrentRoute = route => state => createMatchSelector({
    path: route,
})(state);

export default {
    getRouterHookState,
    getState,
    matchCurrentRoute,
};
