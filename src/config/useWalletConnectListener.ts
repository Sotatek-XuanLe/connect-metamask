import { useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useAppDispatch } from "src/store/hook";
import { setCurrentUser } from "src/redux/user";
import { getChainId, isConnectedByWalletConnect, syncNetwork, walletconnectProvider } from "./walletConnect";
import { syncUserWalletBalance } from "src/helper/funcition";

const useWalletConnectListener = () => {
  const { error } = useWeb3React();
  const provider = walletconnectProvider;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      if (error instanceof UnsupportedChainIdError) {
      }
    }
  }, [error]);

  useEffect(() => {
      if (provider.accounts.length > 0) {
        dispatch(setCurrentUser(provider.accounts[0]));
        // syncUserWalletBalance();
      }
      if (isConnectedByWalletConnect()) {
        syncNetwork(provider.chainId)
        if (!provider.connected) {
          dispatch(setCurrentUser(""))
        }
      }
      provider.onConnect(() => {
        getChainId().then((chainID: any) => {
          syncNetwork(chainID)
        })
      })
      provider.on("accountsChanged", (accounts: any) => {
        if (accounts.length > 0) {
          dispatch(setCurrentUser(accounts[0]))
        }
      });

  }, [provider]);
};
export default useWalletConnectListener;
