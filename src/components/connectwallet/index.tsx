import { useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import web3, { isConnectedByWalletConnect, walletconnect, walletconnectProvider } from '../../config/walletConnect';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useAppDispatch, useBoolean, useCoin } from "src/store/hook";
import * as StyledConnectWallet from '../../components/connectwallet/connectWallet.styled';
import { getLocalStorage, removeLocalStorage, setOneLocalStorage } from "src/config/storage";
import { LOCAL_STORAGE_ADDRESS, LOCAL_STORAGE_WALLETCONNECT, LOCAL_STORAGE_COIN, ZERO, MAIN_NET_ID, LOCAL_STORAGE_CHAINID, METAMASK_URL } from "src/const";
import { getShortAddress, syncUserWalletBalance } from "src/helper/funcition";
import { validationMaxDecimalsNoRound } from "src/helper/bignumber";
import { setCoinUser, setCurrentUser } from 'src/redux/user';
import Option from '../../base/Option/Option';
import { SUPPORTED_WALLETS } from 'src/config/wallet';
import { useActiveWeb3React } from 'src/helper/useActiveWeb3';
import CustomDialog from '../../base/Dialog';
import AccountDetail from '../popup/accountDetail';
import { ERROR_MESSAGE } from 'src/const/error';
import _ from 'lodash';
import { setBalances } from 'src/redux/balances';
const ConnectWallet = () => {
    let { account, activate, deactivate } = useWeb3React<Web3>();
    const { t } = useTranslation();
    const { connector } = useActiveWeb3React();
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [openPopup, showPopup, hidePopup] = useBoolean();
    const [openAccountPopup, showAccountPopup, hideAccountPopup] = useBoolean();
    const [isMetaMask, setIsMetaMask, setIsNotMetaMask] = useBoolean();
    const [textErr, setTextError] = useState<string>("");
    const ethCoin: any = useCoin();
    const addressUser: any = getLocalStorage(LOCAL_STORAGE_ADDRESS);
    const txhash: any = getLocalStorage(LOCAL_STORAGE_CHAINID) ?? MAIN_NET_ID;
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
    const checkIsMetaMaskInstalled = useCallback(async () => {
        const { ethereum } = window;
        const isMetaMaskInstalled = !!(ethereum && ethereum.isMetaMask);

        if (isMetaMaskInstalled) {
            setIsMetaMask();
        } else {
            setIsNotMetaMask();
        }
    }, [setIsMetaMask, setIsNotMetaMask]);
    console.log(isMetaMask, 'isMetaMask');
    // Check if user's browser had Metamask installed
    useEffect(() => {
        checkIsMetaMaskInstalled();
    }, [checkIsMetaMaskInstalled, openPopup]);
    // connect metamask
    const handleConnectMetaMask = useCallback(async () => {
        if (!window.ethereum) {
            return;
        }
        console.log(1);
        setTextError("");
        window.web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const signature = (await getSignature(accounts[0])) as string;
            setLoading();
            const payload = {
                username: accounts[0],
                password: signature,
                message: `Sign this message to login with address ${accounts[0]}`,
            };
            if (payload.username) {
                console.log('metamask logined');
                setTextError("");
                dispatch(setCurrentUser(payload.username));
            };
            hidePopup();
            unsetLoading();
        } catch (err: any) {
            setLoading();
            const _indexErr = _.findIndex(ERROR_MESSAGE, (item: any) => {
                return item.code === err.code
            })
            console.log(ERROR_MESSAGE[_indexErr].message, 'message');
            if (_indexErr > -1) {
                unsetLoading();
                setTextError(ERROR_MESSAGE[_indexErr].message)
            } else {
                setTextError("");
                unsetLoading();


            }
        }
    }, [
        checkIsMetaMaskInstalled,
        dispatch,
        setLoading,
        unsetLoading
    ])

    // CONNECT WALLET QR MOBILE
    const connect = async () => {
        try {
            if (walletconnect && walletconnect.walletConnectProvider) {
                walletconnect.walletConnectProvider = undefined;
            }
            await activate(walletconnect, undefined, false).then((result: any) => {
            }).catch((error: any) => {
            }).finally(() => {

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
        if (isConnectedByWalletConnect()) {
            try {
                walletconnectProvider.disconnect().then((data: any) => {
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
        setTextError("");
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
    // check login logout change account change network metamask browser
    useEffect(() => {
        (async () => {
            if (window.ethereum) {
                // Handle account change
                window.ethereum.on("accountsChanged", async (accounts: any) => {
                    // check change account get eth coin
                    console.log("accountsChanged 111");
                    if (isConnectedByWalletConnect()) {
                        return;
                    }

                    if (accounts.length > 0) {
                        setOneLocalStorage(LOCAL_STORAGE_ADDRESS, accounts);
                        if (accounts) {
                            getCoin(accounts[0]);
                        }

                        dispatch(setCurrentUser(accounts[0]));
                        syncUserWalletBalance();
                    } else {
                        dispatch(setCurrentUser(''));
                        removeLocalStorage(LOCAL_STORAGE_ADDRESS);
                        removeLocalStorage(LOCAL_STORAGE_WALLETCONNECT);
                        removeLocalStorage(LOCAL_STORAGE_COIN);
                        dispatch(setCoinUser(ZERO));
                        unsetLoading();
                    }
                });

                // Handle network change
                window.ethereum.on("chainChanged", async (idNetWork_hex: any) => {
                    let idNetWork = parseInt(idNetWork_hex, 16)
                    if (isConnectedByWalletConnect()) {
                        return;
                    }

                    let address = getAddressFromLocalStorage();
                    if (!address) {
                        return
                    }

                    if (idNetWork) {
                        // reInitWeb3();

                        if (idNetWork === parseInt(MAIN_NET_ID)) {
                            if (address) {
                                getCoin(address);
                                setOneLocalStorage(LOCAL_STORAGE_ADDRESS, address);
                                syncUserWalletBalance();
                            } else {
                                dispatch(setBalances({}));
                            }
                        } else {
                            // Logout current user;
                            dispatch(setBalances({}));
                        }
                    }
                });

            }


        })();
    }, []);

    // login with walletconnect
    useEffect(() => {
        if (account) {
            dispatch(setCurrentUser(account));
            setTextError("");
        }
    }, [account]);
    const handleClickModal = () => {
        showPopup();
    }
    useEffect(() => {
        addressUser ? getCoin(addressUser) : dispatch(setCurrentUser(""));
    }, [addressUser, dispatch, getCoin, account]);
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
                {
                    isMetaMask ?
                        <StyledConnectWallet.SBtnConnectPopup onClick={handleConnectMetaMask}>
                            {isLoading ? <>...</>
                                :
                                <>
                                    {textErr ?
                                        <span>{textErr}</span>
                                        :
                                        <span>Connect to metamask </span>
                                    }
                                </>
                            }
                        </StyledConnectWallet.SBtnConnectPopup>
                        :
                        <StyledConnectWallet.SBtnConnectPopup>
                            <a href={METAMASK_URL}>Install Metamask </a>
                        </StyledConnectWallet.SBtnConnectPopup>
                }

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