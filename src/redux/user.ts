import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBlancesAll } from "src/helper/contract";
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
const fetchBalancesSMC = createAsyncThunk(
  'app/getBalances',
  async (list: Record<string, string | number>[]) => {
    await getBlancesAll(list)
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      setOneLocalStorage("address", action.payload);
      console.log(action.payload, ' action.payload address');
    },
    setCoinUser: (state, action: PayloadAction<string>) => {
      state.coin = divDecimalsNumber(action.payload, EIGHTEEN);
      console.log(action.payload, 'coint');
      const coinFormat: any = divDecimalsNumber(action.payload, EIGHTEEN);
      console.log(coinFormat, 'coinFormat');
      setOneLocalStorage(COOKIES_COIN, coinFormat);
    },
    setChainId: (state, action: PayloadAction<any>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload;
        setOneLocalStorage(CHAINID, action.payload);
      }
    },
  
  },
  extraReducers: {
    [`${fetchBalancesSMC.pending}`]: (state) => {
      state.balances.error = true
    },
    [`${fetchBalancesSMC.rejected}`]: (state, action) => {
      state.balances.data = {}
      state.balances.error = false;
    },
    [`${fetchBalancesSMC.fulfilled}`]: (state, action) => {
      console.log(state, 'state');
      state.balances.data = action.payload;
      state.balances.error = false;
    },
  }
});
export const { setCurrentUser, setCoinUser, setChainId } = userSlice.actions;
export const walletAsyncActions = { fetchBalancesSMC };
const { reducer: userReducer } = userSlice;
export default userReducer;

