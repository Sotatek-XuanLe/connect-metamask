export const MAIN_NET_ID = "4";
export const ZERO = "0";
export const LOCAL_STORAGE_COIN = "coin";
export const LOCAL_STORAGE_ADDRESS = "address";
export const LOCAL_STORAGE_CHAINID = "chainId";
export const LOCAL_STORAGE_WALLETCONNECT = "walletconnect";
export const NETWORK_CONTEXT_NAME = "NETWORK";
export const LOCAL_STORAGE_NETWORK = "network";
export const LOCALE = "locale";
export const GREEN = "#02D394";
export const ANW_ADDRESS = "0x7F40e74AB7B832a49beFf41486B1F2f3B0164821";
export const ANWFI_ADDRESS = "0xE382521b370D6265Fb1D02cE85aC11EAbCF42C8B";
export const WETH_ADDRESS = "0xc90F78BeF0ecca6D343B002C519A330bEb9F7A67";
export const USDC_ADDRESS = "0xC1eD2bF723A24951Ac3b2B7Cb23ecC454Fd2bdAd";
export const USDT_ADDRESS = "0xaF899fFA89338d4C6e420F2157B3bBd91148C79f";
export const SOTA_TEST_ADDRESS = "0x93B1cA6189f9938e06A7d8b8C7eA103DfE44DC3c";
export const SOTA_DEV_ADDRESS = "0x77Ef5dAd75cc5Ee3320Eb62A9A2E03f5da78df88";
export const SOTA_CUSTOMER_ADDRESS = "0x007Fd1Bb9E65b09df6d5521BE2d620f22606C31a";
export const tokenLogoUris = {
    anw: "https://s3.us-west-2.amazonaws.com/anw.finance/anw-square.jpg",
    anwfi: "https://s3.us-west-2.amazonaws.com/anw.finance/anwfi-square.jpg",
    weth: "https://cdn.staticaly.com/gh/TrustWallet/tokens/master/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    usdc: "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    usdt: "https://s3.us-west-2.amazonaws.com/anw.finance/usdt-square.jpg",
    sotaLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnepPDUJI8inAIrqvNH8XTridwGOn4uIZMlShv_3adecli-seML7ZV0W7sxmxcNibiJzA&usqp=CAU"
};
export const METAMASK_URL = 'https://metamask.io/';
export const URL_APP = [
    {
        to: "/home",
        id: "pool-nav-link",
        text: "Home",
    },
    {
        to: "/exchange",
        id: "pool-nav-link",
        text: "Exchange",
    },
    {
        to: "/pool",
        id: "pool-nav-link",
        text: "Pool",
    },
];
export const AUTH_ROUTER = [
    '/',
    '/home',
    '/exchange',
    '/pool',
];
export const LIST_TOKEN = [
    {
        address: ANW_ADDRESS,
        chainId: 4,
        decimals: 18,
        logoURI: tokenLogoUris.anw,
        name: "Anchor Neural World",
        symbol: "ANW",
    },
    {
        address: ANWFI_ADDRESS,
        chainId: 4,
        decimals: 18,
        logoURI: tokenLogoUris.anwfi,
        name: "ANWFI",
        symbol: "ANWFI",
    },
    {
        address: WETH_ADDRESS,
        chainId: 4,
        decimals: 18,
        logoURI: tokenLogoUris.weth,
        name: "Wrapped Ether",
        symbol: "WETH",
    },
    {
        address: USDC_ADDRESS,
        chainId: 4,
        decimals: 6,
        logoURI: tokenLogoUris.usdc,
        name: "USD Coin",
        symbol: "USDC",
    },
    {
        address: USDT_ADDRESS,
        chainId: 4,
        decimals: 6,
        logoURI: tokenLogoUris.usdt,
        name: "Tether (USDT)",
        symbol: "USDT",
    },

    {
        address: SOTA_DEV_ADDRESS,
        chainId: 4,
        decimals: 6,
        logoURI: tokenLogoUris.sotaLogo,
        name: "Sota Dev (STD)",
        symbol: "STD",
    },
    {
        address: SOTA_TEST_ADDRESS,
        chainId: 4,
        decimals: 6,
        logoURI: tokenLogoUris.sotaLogo,
        name: "Sota Test (STT)",
        symbol: "STT",
    },
    {
        address: SOTA_CUSTOMER_ADDRESS,
        chainId: 4,
        decimals: 6,
        logoURI: tokenLogoUris.sotaLogo,
        name: "Sota Customer (STC)",
        symbol: "STC",
    },
]