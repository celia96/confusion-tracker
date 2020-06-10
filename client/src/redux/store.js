import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* eslint-disable no-underscore-dangle */
export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */
export const persistentStore = persistStore(store);
// persistentStore.purge();
