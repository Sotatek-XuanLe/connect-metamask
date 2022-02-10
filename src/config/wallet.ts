
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ChainId } from '@sushiswap/sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { walletconnect } from './walletConnect'
const RPC = {
  [ChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  [ChainId.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD',
  [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
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
  [ChainId.PALM]: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  [ChainId.CELO]: 'https://forno.celo.org',
}
export interface WalletInfo { 
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}
const supportedChainIds = Object.values(ChainId) as number[]
export const injected = new InjectedConnector({
  supportedChainIds,
})
// export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
//     WALLET_CONNECT: {
//       connector: async () => {
//         const WalletConnectConnector = (await import('@web3-react/walletconnect-connector')).WalletConnectConnector
//         return new WalletConnectConnector({
//           rpc: RPC,
//           bridge: 'https://bridge.walletconnect.org',
//           qrcode: true,
//           supportedChainIds: [
//             1, // mainnet
//             3, // ropsten
//             4, // rinkeby
//             5, // goreli
//             42, // kovan
//             250, // fantom
//             4002, // fantom testnet
//             137, // matic
//             80001, // matic testnet
//             100, // xdaiW
//             56, // binance smart chain
//             97, // binance smart chain testnet
//             1287, // moonbase
//             43114, // avalanche
//             43113, // fuji
//             128, // heco
//             256, // heco testnet
//             1666600000, // harmony
//             1666700000, // harmony testnet
//             66, // okex testnet
//             65, // okex testnet
//             42161, // arbitrum
//             42220, // celo
//             11297108109, // palm
//             1285, // moonriver
//           ],
//           // pollingInterval: 15000,
//         })
//       },
//       name: 'Wallet connect',
//       iconName: 'wallet-connect.svg',
//       description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
//       href: null,
//       color: '#4196FC',
//       mobile: true,
//     },
//   }
export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  WALLET_CONNECT: {
    connector: async () => {
      return await walletconnect;
    },
    name: 'WalletConnect',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
};