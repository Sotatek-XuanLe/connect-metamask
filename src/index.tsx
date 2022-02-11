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
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { createWeb3ReactRoot } from "@web3-react/core";
import { NETWORK_CONTEXT_NAME } from './const';
function getLibrary(provider: any) {
  return new Web3(provider);
}
const Web3ReactRoot = createWeb3ReactRoot(NETWORK_CONTEXT_NAME);
function Web3ProviderNetwork({ children, getLibrary }: any) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>;
}

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Provider store={store}>
            <Router>
              <App />
            </Router>
          </Provider>
        </Web3ProviderNetwork>

      </Web3ReactProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
