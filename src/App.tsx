import './App.css';
import './style/app.scss';
import React, { useEffect } from 'react';
import { getLocalStorage } from './config/storage';
import i18n from './components/i18n';
import LanguageSwitch from './components/LanguageSwitch';
import * as StyledApp from '../src/style/app.styled';
import Header from './components/header';
import { AUTH_ROUTER, LOCALE } from './const';
import RouterApp from './components/header/routerApp';
import ConnectWallet from './components/connectwallet';
import useWalletConnectListener from './config/useWalletConnectListener';
import { useLocation } from 'react-router';
import NotFound from './components/notfound';
import { useAppDispatch, useAuthRouter } from "src/store/hook";
import { setAuthRouter } from './redux/router';
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
const App = () => {
  useWalletConnectListener();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const locale = getLocalStorage(LOCALE);
  const isRouter = useAuthRouter();
  // change language
  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);
  const checkNotNavBar = (route: string) => {
    console.log('hi', route);
    if (route && route === '/error') {
      dispatch(setAuthRouter(false));
      return;
    } else {
      dispatch(setAuthRouter(true));
      return;
    }
  };
  console.log(isRouter, 'isRouter');
  useEffect(() => {
    checkNotNavBar(location.pathname)
  }, [location.pathname, checkNotNavBar])
  return (
    <div className="App">
      {isRouter ?
        <header className="App-header">
          <StyledApp.SDivConnectHeader>
            <StyledApp.SDivHeader>
              <StyledApp.SDivMenu>
                <Header />
              </StyledApp.SDivMenu>
              {/* Connect Wallet */}
              <StyledApp.SDivFlex>
                <ConnectWallet />
                {/* Switch language */}
                <LanguageSwitch />
              </StyledApp.SDivFlex>
            </StyledApp.SDivHeader>
            <StyledApp.SMain>
              <RouterApp />
            </StyledApp.SMain>
          </StyledApp.SDivConnectHeader>
        </header>
        :
        <>
          <NotFound />
        </>
      }

    </div >
  );
}
export default App