import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage, setOneLocalStorage } from "../config/storage";
import { divDecimalsNumber } from "../helper/bignumber";
const COOKIES_COIN = "coin";
const COOKIES_ADDRESS = "address";
const EIGHTEEN = 18;
const NETWORK_DEFAULT = "4";
const CHAINID = "chainId";
const initialState = {
  address: getLocalStorage(COOKIES_ADDRESS) ?? "",
  coin: getLocalStorage(COOKIES_COIN) === undefined ? 0 : getLocalStorage(COOKIES_COIN),
  currentUser: <any>{},
  chainId: Number(NETWORK_DEFAULT),
  balances: {
    data: {},
    error: false
  },
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      setOneLocalStorage("address", action.payload);
    },
    setCoinUser: (state, action: PayloadAction<string>) => {
      state.coin = divDecimalsNumber(action.payload, EIGHTEEN);
      const coinFormat: any = divDecimalsNumber(action.payload, EIGHTEEN);
      setOneLocalStorage(COOKIES_COIN, coinFormat);
    },
    setChainId: (state, action: PayloadAction<any>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload;
        setOneLocalStorage(CHAINID, action.payload);
      }
    },

  },
});
export const { setCurrentUser, setCoinUser, setChainId } = userSlice.actions;
const { reducer: userReducer } = userSlice;
export default userReducer;

