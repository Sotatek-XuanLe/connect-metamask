import web3 from "src/config/walletConnect";
import {
    ANWFI_ADDRESS,
    ANW_ADDRESS,
    USDC_ADDRESS,
    WETH_ADDRESS,
    USDT_ADDRESS,
    SOTA_DEV_ADDRESS,
    SOTA_TEST_ADDRESS,
    SOTA_CUSTOMER_ADDRESS,
    LIST_TOKEN
} from "src/const";
import ANW_ABI from '../../src/abis/anw.json';
import ANWFI_ABI from '../../src/abis/anwfi.json';
import WETH_ABI from '../../src/abis/weth.json';
import USDC_ABI from '../../src/abis/usdc.json';
import USDT_ABI from '../../src/abis/usdt.json';
import SOTA_DEV_ABI from '../../src/abis/sotatek_token.json';
import SOTA_TEST_ABI from '../../src/abis/sotatek_token.json';
import SOTA_CUSTOMER_ABI from '../../src/abis/sotatek_token.json';
export const TOKEN_ABI: any = {
    [ANW_ADDRESS]: ANW_ABI,
    [ANWFI_ADDRESS]: ANWFI_ABI,
    [WETH_ADDRESS]: WETH_ABI,
    [USDC_ADDRESS]: USDC_ABI,
    [USDT_ADDRESS]: USDT_ABI,
    [SOTA_DEV_ADDRESS]: SOTA_DEV_ABI,
    [SOTA_TEST_ADDRESS]: SOTA_TEST_ABI,
    [SOTA_CUSTOMER_ADDRESS]: SOTA_CUSTOMER_ABI,
};
export const connectContract = (abi: any, address: string) => {
    if (address && web3) {
        return new web3.eth.Contract(abi, address);
    }
};
export const getBalances = async (contract: any, tokenAddress: string) => {
    if (tokenAddress) {
        if (web3) {
            return await contract.methods.balanceOf(tokenAddress).call();
        }
    }
};
export const getBlancesAll = async (lst: any) => {
    let list = await LIST_TOKEN?.reduce(
        async (listBalances: any, token: any) => {
            if (web3) {
                let accounts = await web3?.eth.getAccounts();
                let balances = await listBalances;
                if (token.address !== undefined && accounts !== undefined) {
                    const contract = await connectContract(
                        TOKEN_ABI[token.address],
                        token.address
                    );
                    if (contract) {
                        const balanceToken = await getBalances(contract, accounts[0]);
                        return {
                            ...balances,
                            [token.address]: balanceToken,
                        };
                    }
                }
            }
        },
        Promise.resolve([])
    );
    return list
};