import './App.css';
import './style/app.scss';
import React, {useEffect } from 'react';
import { getLocalStorage } from './config/storage';
import i18n from './components/i18n';
import LanguageSwitch from './components/LanguageSwitch';
import * as StyledApp from '../src/style/app.styled';
import Header from './components/header';
import { LOCALE } from './const';
import RouterApp from './components/header/routerApp';
import ConnectWallet from './components/connectwallet';
import useWalletConnectListener from './config/useWalletConnectListener';
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
const App = () => {
  useWalletConnectListener();
  const locale = getLocalStorage(LOCALE);
  // change language
  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);
  return (
    <div className="App">
      <header className="App-header">
        <StyledApp.SDivConnectHeader>
          <StyledApp.SDivHeader>
            <StyledApp.SDivMenu>
              <Header />
              <RouterApp />
            </StyledApp.SDivMenu>
            {/* Connect Wallet */}
            <ConnectWallet />
            {/* Switch language */}
            <LanguageSwitch />
          </StyledApp.SDivHeader>
        </StyledApp.SDivConnectHeader>
      </header>
    </div >
  );
}
export default App