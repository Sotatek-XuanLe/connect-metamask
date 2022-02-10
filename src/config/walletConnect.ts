
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { providers } from "ethers";
import Web3 from "web3";
import store from "../store/store";
import { getLocalStorage, setOneLocalStorage } from "./storage";
import { setChainId } from "../redux/user";
let web3: any;
const COOKIES_ADDRESS = "address";
const COOKIES_NETWORK = "network";
const INFURA_ID = "eb6e505f1a684c75aba4a096a5000718";
const INFURA_MAIN_NET = "https://mainnet.infura.io/v3/" + INFURA_ID;
const INFURA_TEST_NET = "https://rinkeby.infura.io/v3/" + INFURA_ID;
const NETWORK_DEFAULT = "4";
const ETHERIUM_MAINEST = {
  chainId: "1",
  name: "Mainnet",
};
const RINKEBY_TESTNEST = {
  chainId: "4",
  name: "Rinkeby",
};
//Create WalletConnect Provider
const RPC_DEFAULT = "https://bridge.walletconnect.org";
export const resetWalletConnector = (connector: AbstractConnector) => {
  if (
    connector &&
    connector instanceof WalletConnectConnector &&
    connector.walletConnectProvider?.wc?.uri
  ) {
    connector.walletConnectProvider = undefined
  }
}
export const walletconnectProvider = new WalletConnectProvider({
  infuraId: INFURA_ID,
  rpc: {
    1: INFURA_MAIN_NET,
    4: INFURA_TEST_NET,
    56: RPC_DEFAULT,
    3: RPC_DEFAULT,
    5: RPC_DEFAULT,
    42: RPC_DEFAULT,
    250: RPC_DEFAULT,
    4002: RPC_DEFAULT,
    137: RPC_DEFAULT,
    80001: RPC_DEFAULT,
    100: RPC_DEFAULT,
    97: RPC_DEFAULT,
    1287: RPC_DEFAULT,
    43114: RPC_DEFAULT,
    43113: RPC_DEFAULT,
    128: RPC_DEFAULT,
    256: RPC_DEFAULT,
    1666600000: RPC_DEFAULT,
    1666700000: RPC_DEFAULT,
    66: RPC_DEFAULT,
    65: RPC_DEFAULT,
    42161: RPC_DEFAULT,
    42220: RPC_DEFAULT,
    11297108109: RPC_DEFAULT,
    1285: RPC_DEFAULT
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
})

if (Boolean(localStorage.getItem("walletconnect"))) {
  walletconnectProvider.enable()
    .then((res: any) => {
      console.log("walletconnectProvider done: ", walletconnectProvider, res)
      walletconnectProvider.on("accountsChanged", (accounts: string[]) => {
        console.log("accountsChanged1: ", accounts);
      });

      // Subscribe to chainId change
      walletconnectProvider.on("chainChanged", (chainId: number) => {
        console.log("chainChanged1: ", chainId);
      });

      walletconnectProvider.on("networkChanged", (chainId: number) => {
        console.log("networkChanged: ", chainId);
      });
    })
    .catch((err: any) => {
      console.log("walletconnectProvider err: ", err)
      walletconnectProvider.disconnect();
    })
}

export const wcweb3Provider = new providers.Web3Provider(walletconnectProvider);

walletconnectProvider.on("accountsChanged", (accounts: string[]) => {
  console.log("accountsChanged1: ", accounts);
});

// Subscribe to chainId change
walletconnectProvider.on("chainChanged", (chainId: number) => {
  console.log("chainChanged1: ", chainId);
});

walletconnectProvider.on("networkChanged", (chainId: number) => {
  console.log("networkChanged: ", chainId);
});

export const walletconnect = new WalletConnectConnector({
  rpc: { [walletconnectProvider.chainId]: walletconnectProvider.rpcUrl },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

// web3
const walletConnectStorageKey = "walletconnect";
export const isConnectedByWalletConnect = () => Boolean(localStorage.getItem(walletConnectStorageKey));
export const getChainId = (): any => {
  if (isConnectedByWalletConnect()) {
    return new Promise<any>((resolve) => {
      resolve(walletconnectProvider.chainId)
    });
  } else if (web3) {
    return new Promise<any>((resolve) => {
      web3.eth
        .getChainId()
        .then((chainId: string) => {
          resolve(chainId);
        })
        .catch(() => resolve(undefined));
    });
  }
};
export const syncNetwork = (network: any) => {
  console.log("syncNetwork: ", network)
  setOneLocalStorage(COOKIES_NETWORK, network);
  store && store.dispatch(setChainId(network));
}
export const reInitWeb3 = () => {
  let address = getLocalStorage(COOKIES_ADDRESS)
  if (isConnectedByWalletConnect()) {
    web3 = new Web3(walletconnectProvider.rpcUrl)
  } else if (window.ethereum) {
    if (address) {
      web3 = new Web3(window.ethereum) || "https://data-seed-prebsc-1-s1.binance.org:8545/";
    } else {
      let infura = NETWORK_DEFAULT == ETHERIUM_MAINEST.chainId ? INFURA_MAIN_NET : INFURA_TEST_NET
      web3 = new Web3(infura)
    }
  } else {
    let infura = NETWORK_DEFAULT == ETHERIUM_MAINEST.chainId ? INFURA_MAIN_NET : INFURA_TEST_NET
    web3 = new Web3(infura)
  }

  getChainId().then((chainId: any) => {
    syncNetwork(chainId);
  })
}

reInitWeb3();
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
}
export default web3;
