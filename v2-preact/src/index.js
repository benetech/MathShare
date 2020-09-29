import './style';
import '../../images/favicon.png';

import App from './components/app';
import { Provider } from "redux-zero/preact";
import store from "./store";

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);