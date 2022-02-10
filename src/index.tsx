import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '../src/store/store';
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core';
import i18n from "./components/i18n";
import Web3 from "web3";
import { I18nextProvider } from "react-i18next";
const POLLING_INTERVAL = 12000;
// const getLibrary = (provider: any) => {
//   const library = new ethers.providers.Web3Provider(provider);
//   library.pollingInterval = POLLING_INTERVAL;
//   return library;
// };
function getLibrary(provider: any) {
  return new Web3(provider);
}
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <App />
        </Provider>
      </Web3ReactProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
