import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { providers } from "ethers";
import Web3 from "web3";
import { ChainId } from '@sushiswap/sdk';
import store from "../store/store";
import { getLocalStorage, setOneLocalStorage } from "./storage";
import { setChainId } from "../redux/user";
import { LOCAL_STORAGE_WALLETCONNECT } from "src/const";
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
// const RINKEBY_TESTNEST = {
//   chainId: "4",
//   name: "Rinkeby",
// };
//Create WalletConnect Provider
export const RPC = {
  [ChainId.MAINNET]: "https://mainnet.infura.io/v3/" + INFURA_ID,
  [ChainId.ROPSTEN]: 'https://ropsten.infura.io/v3/' + INFURA_ID,
  [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/' + INFURA_ID,
  [ChainId.GÖRLI]: 'https://goerli.infura.io/v3/' + INFURA_ID,
  [ChainId.KOVAN]: 'https://kovan.infura.io/v3/' + INFURA_ID,
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.PALM]:
    'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  [ChainId.CELO]: 'https://forno.celo.org',
};

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
  rpc: RPC,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 10000,
  clientMeta: {
    description: "WalletConnect Developer App",
    url: "https://walletconnect.org",
    icons: ["https://s2.coinmarketcap.com/static/img/coins/64x64/6120.png"],
    name: "WalletConnect",
  },
})

if (Boolean(localStorage.getItem("walletconnect"))) {
  walletconnectProvider.enable()
    .then((res) => {

    })
    .catch((err) => {
      console.log("walletconnectProvider err: ", err)
      walletconnectProvider.disconnect();
    })
}

if (Boolean(getLocalStorage(LOCAL_STORAGE_WALLETCONNECT))) {
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
      walletconnectProvider.stop((r: any) => {
        console.log(r, 'r11111111111111');
      })
    })
    .catch((err: any) => {
      console.log("walletconnectProvider err: ", err)
      walletconnectProvider.disconnect();
    })

  walletconnectProvider.stop((r: any) => {
    console.log(r, 'r2222222222222222222');
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
      let infura = NETWORK_DEFAULT === ETHERIUM_MAINEST.chainId ? INFURA_MAIN_NET : INFURA_TEST_NET
      web3 = new Web3(infura)
    }
  } else {
    let infura = NETWORK_DEFAULT === ETHERIUM_MAINEST.chainId ? INFURA_MAIN_NET : INFURA_TEST_NET
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
