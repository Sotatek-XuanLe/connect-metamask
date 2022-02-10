import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '../src/store/store';
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import Web3 from "web3";
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
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <App />
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
