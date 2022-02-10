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
import { Dialog, IconButton, makeStyles } from '@material-ui/core';
import './style/app.scss';
import CloseIcon from '@material-ui/icons/Close';
import { setCurrentUser, setCoinUser } from './redux/user';
import { getLocalStorage, removeLocalStorage, setOneLocalStorage } from './config/storage';
import { useAppDispatch } from './store/hook';
import Cookies from 'js-cookie'
import web3 from './config/walletConnect';
import styled from "styled-components";
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
  console.log(address, "address");
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
  const { activate } = useWeb3React();
  const [address, setAddress] = React.useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const setModal = () => {
    setOpenModal(false)
  }
  const dispatch = useAppDispatch();
  const addressUser: any = getLocalStorage(COOKIES_ADDRESS);
  console.log(addressUser, 'addressUser');

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
      console.log(1);
      setOpenModal(false)
      // log selected wallet
      ReactGA.event({
        category: "Wallet",
        action: "Change Wallet",
        label: name,
      });
      console.log(2);

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
          console.log(error, 'err');
          if (error instanceof UnsupportedChainIdError) {
            activate(conn);
            console.log(2);

            // a little janky...can't use setError because the connector isn't set
          } else {

          }
        });
      console.log(3);

    },
    [activate]
  );
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

              tryActivation(option.connector);

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
    } catch (err: any) {
      setAddress("");
    }
  };
  const handleLogOut = () => {
    removeLocalStorage("address");
    setAddress("");
  }
  const getCoin = useCallback(
    async (adr: string) => {
      try {
        if (adr) {
          console.log('adr',adr);
          if (web3) {
            console.log(web3,'web3');
            
            await web3.eth.getBalance(adr)
              .then((result: any) => {
                console.log(123, result);
                if (result) {
                  console.log(456, result);
  
                  dispatch(setCoinUser(result));
                }
              }).catch((err: any) => {
                console.log(345,err);
                
              })
          }
        }
      }
      catch{

      }

    },
    []
  );
  const getAddressFromCookies = (): string | undefined => {
    return Cookies.get(COOKIES_ADDRESS) ?? ""
  }
  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        // Handle account change
        window.ethereum.on("accountsChanged", async (accounts: any) => {
          // check change account get eth coin
          if (accounts.length > 0) {
            if (accounts) {
              console.log(accounts, 'acc');
              getCoin(accounts[0]);
            }
            dispatch(setCurrentUser(accounts[0]));
          } else {
            console.log("Clear user data 3");
            dispatch(setCurrentUser(""));
          }
        });

        // Handle network change
        window.ethereum.on("chainChanged", async (idNetWork_hex: any) => {
          let idNetWork = parseInt(idNetWork_hex, 16)
          let address = getAddressFromCookies();
          if (idNetWork) {
            if (idNetWork === parseInt("4")) {
              if (address) {
                getCoin(address);
                Cookies.set(COOKIES_ADDRESS, address);
              } else {
              }
            } else {
              // Logout current user;

            }
          }
        });

        // Reload network interface with the new networkId
      }

      // Check if the user logout of metamask
    })();
  }, []);
  useEffect(() => {
    console.log(addressUser, 'addressUser');
    console.log(getCoin(addressUser),'coin');
   
    addressUser ? getCoin(addressUser) : dispatch(setCurrentUser(""));
  }, [addressUser, dispatch, getCoin]);
  const x : any= getCoin(addressUser).then((r:any)=>{
    console.log(r,'rrrrrrrrrr');
  });
  console.log(x,'x');
  
  return (
    <div className="App">
      <header className="App-header">
        {!address &&
          <div onClick={handleClickModal} className='meta-mask'>
            <span className={'btn-connect'}>Connect to wallet</span>
          </div>
        }
        {address && <div>Address: {address}</div>}
        {address && <button onClick={handleLogOut}>Logout</button>}
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
        <SBtnConnect onClick={handleConnectMetaMask}>
          <span>Connect to metamask </span>
        </SBtnConnect>
        <div className='wallet-connect'>{getOptions}</div>
      </Dialog>
    </div>
  );
}
const SBtnConnect = styled.div`
  font-size: 18px !important;
    line-height: 27px;
    color: #fff !important;
    padding: 15px;
    border-radius: 50px !important;
`
