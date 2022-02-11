import { useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useAppDispatch } from "src/store/hook";
import { setCurrentUser } from "src/redux/user";
import { getChainId, isConnectedByWalletConnect, syncNetwork, walletconnectProvider } from "./walletConnect";

const useWalletConnectListener = () => {
  const { error } = useWeb3React();
  const provider = walletconnectProvider;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      if (error instanceof UnsupportedChainIdError) {
        console.log("UnsupportedChainIdError");
      }
    }
  }, [error]);

  useEffect(() => {
      console.log("init")
      if (provider.accounts.length > 0) {
        dispatch(setCurrentUser(provider.accounts[0]))
      }
      if (isConnectedByWalletConnect()) {
        syncNetwork(provider.chainId)
        if (!provider.connected) {
          dispatch(setCurrentUser(""))
        }
      }
      provider.onConnect(() => {
        console.log("wallet onConnect")
        getChainId().then((chainID: any) => {
          syncNetwork(chainID)
        })
      })
      provider.on("accountsChanged", (accounts: any) => {
        console.log("WC accountsChanged", accounts);
        if (accounts.length > 0) {
          dispatch(setCurrentUser(accounts[0]))
        }
      });

  }, [provider]);
};
export default useWalletConnectListener;
