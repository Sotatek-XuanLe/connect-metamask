import './App.css';
import Web3 from 'web3';
import { AbstractConnector } from '@web3-react/abstract-connector'
import React, { useState } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { SUPPORTED_WALLETS } from './config/wallet'
import Option from './base/Option/Option';
import ReactGA from 'react-ga'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { Dialog, IconButton, makeStyles } from '@material-ui/core';
import './style/app.scss';
import CloseIcon from '@material-ui/icons/Close';
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
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
  console.log(address, 'address');
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
  const { activate } = useWeb3React();
  const [address, setAddress] = React.useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const setModal = () => {
    setOpenModal(false)
  }
  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      // return rest of options
      return (
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/images/wallets/' + option.iconName}
          />
        )
      )
    })
  }
  const tryActivation = async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined) => {
    let name = ''
    let conn: any = typeof connector === 'function' ? await connector() : connector

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (conn instanceof WalletConnectConnector && conn.walletConnectProvider?.wc?.uri) {
      conn.walletConnectProvider = undefined
    }

    conn &&
      activate(conn, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn) // a little janky...can't use setError because the connector isn't set
        } else {
        }
      })
  }
  const handleClickModal = () => {
    setOpenModal(true)
  }
  const handleConnectMetaMask = async () => {
    if (!window.ethereum) {
      setAddress('')
      return;
    }
    window.web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const signature = (await getSignature(accounts[0])) as string;
      const payload = {
        username: accounts[0],
        password: signature,
        message: `Sign this message to login with address ${accounts[0]}`,
      };
      setAddress(payload && payload.username)
    }
    catch (err: any) {
      setAddress('')
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <div onClick={handleClickModal} className='meta-mask'>
          <span className={'btn-connect'}>Connect to wallet</span>
        </div>
        {address && (
          <div>
            Address: {address}
          </div>
        )}
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
        <div onClick={handleConnectMetaMask} className='meta-connect'>
          <span>Connect to metamask </span>
        </div>
        <div className='wallet-connect'>{getOptions()}</div>
      </Dialog>
    </div>
  );
}
