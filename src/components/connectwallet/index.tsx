import React, { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import CloseIcon from '@material-ui/icons/Close';
import web3, { isConnectedByWalletConnect, walletconnect, walletconnectProvider } from '../../config/walletConnect';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useAppDispatch, useBoolean, useCoin } from "src/store/hook";
import * as StyledConnectWallet from '../../components/connectwallet/connectWallet.styled';
import { getLocalStorage, removeLocalStorage, setOneLocalStorage } from "src/config/storage";
import { LOCAL_STORAGE_ADDRESS, LOCAL_STORAGE_WALLETCONNECT, LOCAL_STORAGE_COIN, ZERO, MAIN_NET_ID, LOCAL_STORAGE_CHAINID } from "src/const";
import { getShortAddress } from "src/helper/funcition";
import { validationMaxDecimalsNoRound } from "src/helper/bignumber";
import { setCoinUser, setCurrentUser } from 'src/redux/user';
import Option from '../../base/Option/Option';
import { Dialog } from '@material-ui/core';
import { SUPPORTED_WALLETS } from 'src/config/wallet';
import { useActiveWeb3React } from 'src/helper/useActiveWeb3';
import CustomDialog from '../../base/Dialog';
import AccountDetail from '../popup/accountDetail';
const ConnectWallet = () => {
    let { account, activate, deactivate } = useWeb3React<Web3>();
    const { t } = useTranslation();
    const { connector } = useActiveWeb3React();
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [openPopup, showPopup, hidePopup] = useBoolean();
    const [openAccountPopup, showAccountPopup, hideAccountPopup] = useBoolean();
    const ethCoin: any = useCoin();
    const addressUser: any = getLocalStorage(LOCAL_STORAGE_ADDRESS);
    const txhash : any = getLocalStorage(LOCAL_STORAGE_CHAINID) ?? MAIN_NET_ID;
    const dispatch = useAppDispatch();
    const getSignature = (address: string): any => {
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
    // connect metamask
    const handleConnectMetaMask = async () => {
        if (!window.ethereum) {
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
            if (payload.username) {
                dispatch(setCurrentUser(payload.username));
                console.log(addressUser,'333');
                
            };
            hidePopup();
            unsetLoading();
        } catch (err: any) {
            unsetLoading();
        }
    };

    // CONNECT WALLET QR MOBILE
    const connect = async () => {
        try {
            if (walletconnect && walletconnect.walletConnectProvider) {
                walletconnect.walletConnectProvider = undefined;
            }
            await activate(walletconnect, undefined, false).then((result: any) => {
                console.log(result, 'result');
                console.log(walletconnect, 'walletconnect');
            }).catch((error: any) => {
                console.log('error', error);
            }).finally(() => {
                console.log('done');

            })
            if (isConnectedByWalletConnect()) {
                window.location.reload();
            }

        } catch (error) {
            alert("Some thing went wrong!");
        } finally {
            hidePopup();
        }
    };
    // Disconect
    const disconnect = useCallback(async (type: any) => {
        console.log('click logout');
        if (isConnectedByWalletConnect()) {
            try {
                walletconnectProvider.disconnect().then((data: any) => {
                    console.log(data, 'data');
                    deactivate();
                })
            } catch (error) {
                console.error("Exception " + error);
                dispatch(setCurrentUser(''));
                removeLocalStorage(LOCAL_STORAGE_ADDRESS);
                removeLocalStorage(LOCAL_STORAGE_WALLETCONNECT);
                removeLocalStorage(LOCAL_STORAGE_COIN);
                dispatch(setCoinUser(ZERO));
                unsetLoading();
            }
        }
        dispatch(setCurrentUser(''));
        removeLocalStorage(LOCAL_STORAGE_ADDRESS);
        removeLocalStorage(LOCAL_STORAGE_WALLETCONNECT);
        removeLocalStorage(LOCAL_STORAGE_COIN);
        dispatch(setCoinUser(ZERO));
        unsetLoading();

    }, [addressUser]);
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
    }, [connector, connect]);
    //get coin
    // get address
    const getAddressFromLocalStorage = (): string | undefined => {
        return getLocalStorage(LOCAL_STORAGE_ADDRESS) ?? ""
    }

    // get coin
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
    // login with walletconnect
    useEffect(() => {
        if (account) {
            dispatch(setCurrentUser(account));
        }
        console.log('not account,', account);

    }, [account]);
    const handleClickModal = () => {
        showPopup();
    }
    useEffect(() => {
        addressUser ? getCoin(addressUser) : dispatch(setCurrentUser(""));
    }, [addressUser, dispatch, getCoin, account]);
    console.log(addressUser,'ad');
    
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
                    let address: any = getAddressFromLocalStorage();
                    if (idNetWork) {
                        if (idNetWork === parseInt(MAIN_NET_ID)) {
                            if (address) {
                                getCoin(address);
                                setOneLocalStorage(LOCAL_STORAGE_ADDRESS, address);
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
    return (
        <>
            {/* Connect Wallet */}
            {
                !!isLoading ? <StyledConnectWallet.SDivLoader />
                    :
                    addressUser && addressUser !== '' ?
                        <StyledConnectWallet.SDivConnect>
                            <StyledConnectWallet.SAddress onClick={showAccountPopup}>{getShortAddress(addressUser)}</StyledConnectWallet.SAddress>
                            {
                                ethCoin && ethCoin > 0 ?
                                    <StyledConnectWallet.SCoin>{validationMaxDecimalsNoRound(ethCoin, 4)} ETH</StyledConnectWallet.SCoin>
                                    :
                                    <StyledConnectWallet.SCoin>0 ETH</StyledConnectWallet.SCoin>
                            }
                            <StyledConnectWallet.SDivLogout onClick={disconnect}>{t('Disconnect')}</StyledConnectWallet.SDivLogout>
                        </StyledConnectWallet.SDivConnect>
                        :
                        <>
                            <StyledConnectWallet.SBtnConnect onClick={handleClickModal}>

                                {t('Connect to wallet')}
                            </StyledConnectWallet.SBtnConnect>
                        </>
            }
            <CustomDialog
                open={openPopup}
                onClose={() => {
                    hidePopup();
                }}
                style={{ zIndex: 9999 }}
                fullWidth
                maxWidth={'sm'}
            >
                <StyledConnectWallet.SBtnConnectPopup onClick={handleConnectMetaMask}>
                    <span>Connect to metamask </span>
                </StyledConnectWallet.SBtnConnectPopup>
                <StyledConnectWallet.SBtnConnectPopup>{getOptions}</StyledConnectWallet.SBtnConnectPopup>
            </CustomDialog>
            {/*  account detail */}
            <AccountDetail
                open={openAccountPopup}
                onClose={() => {
                    hideAccountPopup();
                }}
                address={addressUser}
                txhash={txhash}
            />
            {/* End Connect Wallet */}

        </>
    )
}
export default ConnectWallet;