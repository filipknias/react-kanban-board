import React from 'react';
import ReactDOM from 'react-dom/client';
import 'src/index.css';
import App from 'src/App';
import { Provider } from 'react-redux';
import { store } from 'src/redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);