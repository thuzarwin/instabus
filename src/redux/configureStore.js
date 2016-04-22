import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { mobile } from 'libs/mobile';

import rootReducer from 'reducers';
import DevTools from 'redux/DevTools';

let finalCreateStore;
if (!mobile && process.env.NODE_ENV !== 'production') {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(createLogger()),
    DevTools.instrument(),
  )(createStore);
}
else {
  finalCreateStore = compose(
    applyMiddleware(thunk),
  )(createStore);
}

export default function configureStore() {
  const InitialState = {};
  const store = finalCreateStore(rootReducer, InitialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}