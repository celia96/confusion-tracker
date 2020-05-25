import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistentStore } from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistentStore}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
