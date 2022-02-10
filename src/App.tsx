import './App.css';
import Web3 from 'web3';
import { AbstractConnector } from '@web3-react/abstract-connector'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { SUPPORTED_WALLETS } from './config/wallet'
import Option from './base/Option/Option';
import ReactGA from 'react-ga';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Dialog } from '@material-ui/core';
import './style/app.scss';
import CloseIcon from '@material-ui/icons/Close';
import { setCurrentUser, setCoinUser } from './redux/user';
import { getLocalStorage, removeLocalStorage, setOneLocalStorage } from './config/storage';
import { useAppDispatch, useBoolean, useCoin } from './store/hook';
import Cookies from 'js-cookie'
import web3, { isConnectedByWalletConnect, walletconnect, walletconnectProvider } from './config/walletConnect';
import styled from "styled-components";
import i18n from './components/i18n';
import { useTranslation } from "react-i18next";
import LanguageSwitch from './components/LanguageSwitch';
import { getShortAddress } from './helper/funcition';
import { validationMaxDecimalsNoRound } from './helper/bignumber';
// ReactGA.initialize('UA-xxxxxxxxx-x');

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    250, // fantom
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdaiW
    56, // binance smart chain
    97, // binance smart chain testnet
    1287, // moonbase
    43114, // avalanche
    43113, // fuji
    128, // heco
    256, // heco testnet
    1666600000, // harmony
    1666700000, // harmony testnet
    66, // okex testnet
    65, // okex testnet
    42161, // arbitrum
    42220, // celo
    11297108109, // palm
    1285, // moonriver
  ],
});

export const getSignature = (address: string): any => {
  let web3: any;
  const _message = `Sign this message to login with address ${address}`;
  if (web3) {
    return new Promise<any>((resolve: (value: string) => void, reject) => {
      web3.eth.personal
        .sign(_message, address)
        .then((signature: string) => {
          resolve(signature);
        })
        .catch((err: any) => reject(err));
    });
  }
};

export default function App({
  connector,
  error = false,
  setPendingError,
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError?: (error: boolean) => void
}) {
  const COOKIES_ADDRESS = 'address';
  const locale = getLocalStorage("locale");
  const { t } = useTranslation();
  let { account, activate, deactivate } = useWeb3React<Web3>();
  const [, setAddress] = React.useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const setModal = () => {
    setOpenModal(false)
  }
  const ethCoin: any = useCoin();
  const dispatch = useAppDispatch();
  const addressUser: any = getLocalStorage(COOKIES_ADDRESS);
  const [isLoading, setLoading, unsetLoading] = useBoolean();
  const tryActivation = useCallback(
    async (
      connector:
        | (() => Promise<AbstractConnector>)
        | AbstractConnector
        | undefined
    ) => {
      let name = "";
      let conn: any =
        typeof connector === "function" ? await connector() : connector;

      Object.keys(SUPPORTED_WALLETS).map((key) => {
        if (connector === SUPPORTED_WALLETS[key].connector) {
          return (name = SUPPORTED_WALLETS[key].name);
        }
        return true;
      });
      setOpenModal(false)
      // log selected wallet
      ReactGA.event({
        category: "Wallet",
        action: "Change Wallet",
        label: name,
      });
      /**
       *
       * if the connector is walletconnect
       * and the user has already tried to connect,
       * manually reset the connector
       *
       *  */
      if (
        conn instanceof WalletConnectConnector &&
        conn.walletConnectProvider?.wc?.uri
      ) {
        conn.walletConnectProvider = undefined;
      }
      conn &&
        activate(conn, undefined, true).catch((error: any) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(conn);
            // a little janky...can't use setError because the connector isn't set
          } else {
          console.log('err');
          }
        });
    },
    [activate]
  );
  const connect = async () => {
    setLoading();
    try {
      if (walletconnect && walletconnect.walletConnectProvider) {
        walletconnect.walletConnectProvider = undefined;
      }
      await activate(walletconnect, undefined, false).then((result:any)=>{
        console.log(result,'result');
      }).
      catch((error:any)=>{
        console.log('error',error);
      })
      .finally(()=>{
        console.log('done');
      })
      if (isConnectedByWalletConnect()) {
        window.location.reload();
      }
    } catch (error) {
      alert("Some thing went wrong!");
    } finally {
      setOpenModal(false);
      unsetLoading();
    }
  };

  // Get WalletConnect supported option
  const getOptions = useMemo(() => {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      // return rest of options
      return (
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              console.log(option, 'option');

              // tryActivation(option.connector);
              connect();
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={(option.name)}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/images/wallets/' + option.iconName}
          />
        )
      );
    });
  }, [connector, tryActivation]);

  const handleClickModal = () => {
    setOpenModal(true)
  }
  const handleConnectMetaMask = async () => {
    if (!window.ethereum) {
      setAddress("");
      return;
    }
    setLoading();
    window.web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signature = (await getSignature(accounts[0])) as string;
      const payload = {
        username: accounts[0],
        password: signature,
        message: `Sign this message to login with address ${accounts[0]}`,
      };
      setAddress(payload && payload.username);
      if (payload.username) {
        dispatch(setCurrentUser(payload.username));
      };
      setOpenModal(false);
      unsetLoading();
    } catch (err: any) {
      setAddress("");
      unsetLoading();
    }
  };
  const handleLogOut = useCallback(async (type: any) => {
    console.log('click logout');
    if (isConnectedByWalletConnect()) {
      try {
        walletconnectProvider.disconnect().then((data: any) => {
          console.log(data,'data');
          deactivate();
        })
      } catch (error) {
        console.error("Exception " + error);
        dispatch(setCurrentUser(''));
        removeLocalStorage("address");
        removeLocalStorage("walletconnect");
        removeLocalStorage("coin");
        dispatch(setCoinUser('0'));
        unsetLoading();
      }
    }
    dispatch(setCurrentUser(''));
    removeLocalStorage("address");
    removeLocalStorage("walletconnect");
    removeLocalStorage("coin");
    dispatch(setCoinUser('0'));
    unsetLoading();

  }, [addressUser]);
  const getCoin = useCallback(
    async (adr: string) => {
      try {
        if (adr) {
          setLoading();
          if (web3) {
            await web3.eth.getBalance(adr)
              .then((result: any) => {
                if (result) {
                  dispatch(setCoinUser(result));
                  unsetLoading();
                }
              }).catch((err: any) => {
                console.log(err);
                unsetLoading();
              })
          }
        }
      }
      catch (err) {
        console.log(err);
      }
    },
    [dispatch]
  );
  // get address
  const getAddressFromLocalStorage = (): string | undefined => {
    return getLocalStorage(COOKIES_ADDRESS) ?? ""
  }
  // login with walletconnect
  useEffect(() => {
    if (account) {
      dispatch(setCurrentUser(account));
    }
  }, [account]);
  // change acc, change network
  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        // Handle account change
        window.ethereum.on("accountsChanged", async (accounts: any) => {
          // check change account get eth coin
          if (accounts.length > 0) {
            if (accounts) {
              getCoin(accounts[0]);
            }
            dispatch(setCurrentUser(accounts[0]));
          } else {
            dispatch(setCurrentUser(""));
          }
        });

        // Handle network change
        window.ethereum.on("chainChanged", async (idNetWork_hex: any) => {
          let idNetWork = parseInt(idNetWork_hex, 16)
          let address = getAddressFromLocalStorage();
          if (idNetWork) {
            if (idNetWork === parseInt("4")) {
              if (address) {
                getCoin(address);
                Cookies.set(COOKIES_ADDRESS, address);
              } else {
              }
            } else {
              // Logout current user;
              console.log('log out');
            }
          }
        });

        // Reload network interface with the new networkId
      }

      // Check if the user logout of metamask
    })();
  }, [getCoin, dispatch]);
  // get coin
  useEffect(() => {
    addressUser ? getCoin(addressUser) : dispatch(setCurrentUser(""));
  }, [addressUser, dispatch, getCoin]);

  // change language
  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);
  return (
    <div className="App">
      <header className="App-header">
        <SDivConnectHeader>
          <SDivHeader>
            {
              !!isLoading ? <SDivLoader />
                :
                addressUser && addressUser !== '' ?
                  <SDivConnect>
                    <SAddress>{getShortAddress(addressUser)}</SAddress>
                    {
                      ethCoin && ethCoin > 0 ?
                        <SCoin>{validationMaxDecimalsNoRound(ethCoin, 3)} ETH</SCoin>
                        :
                        <SCoin>0 ETH</SCoin>
                    }
                    <SDivLogout onClick={handleLogOut}>{t('Disconnect')}</SDivLogout>
                  </SDivConnect>
                  :
                  <>
                    <SBtnConnect onClick={handleClickModal}>

                      {t('Connect to wallet')}
                    </SBtnConnect>
                  </>
            }

            <LanguageSwitch />
          </SDivHeader>
        </SDivConnectHeader>
      </header>

      <Dialog
        open={openModal}
        onClose={setOpenModal}
        style={{ zIndex: 9999 }}
        fullWidth
        maxWidth={'sm'}
      >
        <div className={'btn-close'} onClick={setModal}>
          <CloseIcon />
        </div>
        <SBtnConnectPopup onClick={handleConnectMetaMask}>
          <span>Connect to metamask </span>
        </SBtnConnectPopup>
        <SBtnConnectPopup>{getOptions}</SBtnConnectPopup>
      </Dialog>
    </div >
  );
}
const SDivConnectHeader = styled.div`
    width: 100%;
    position: fixed;
    top: 0; 
`
const SDivHeader = styled.div`
    width:100%;
    background:#0c0b19;
    display:flex;
    align-items:center;
    justify-content:flex-end;
    padding:5px;

`
const SDivConnect = styled.div`
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #131421;
    border-radius: 50px;
    color: #bfbfbf;
`
const SDivLogout = styled.div`
  background: #262a47 !important;
  padding: 10px;
  border-radius: 50px;
  font-weight: 400;
  color: #fff;
  cursor:pointer;
  font-size:14px;
  margin-left:10px;
`
const SBtnConnect = styled.div`
    font-size: 18px !important;
    line-height: 27px;
    color: #fff !important;
    padding: 10px;
    border-radius: 50px !important;
    background-color: rgba(76,255,163,0.2);
    width: 190px;
    cursor:pointer;
    @media screen and (max-width: 767px) {
      width:30%;
    }
`
const SBtnConnectPopup = styled.div`
  color: #ffffff;
    opacity: 0.7;
    cursor: pointer;
    height: 56px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    background: rgba(23,26,46,1);
    border: 1px solid rgba(23,26,46,1);
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-weight: 500;
    line-height: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 0 15px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
`
const SAddress = styled.div`
    font-size:14px;
`
const SCoin = styled.div`
    font-size:14px;
    margin-left:10px;
`
const SDivLoader = styled.div`
  border: 2px solid #02d394;
  border-radius: 50%;
  border-top: 2px solid #333;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;