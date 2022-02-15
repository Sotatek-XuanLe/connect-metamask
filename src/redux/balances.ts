import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBlancesAll } from "src/helper/contract";

const initialState: any = {
};
const fetchBalancesSMC = createAsyncThunk(
    'app/getBalances',
    async (list: Record<string, string | number>[]) => {
      await getBlancesAll(list)
    }
  );

export const balancesSlice = createSlice({
    name: "app/balances",
    initialState,
    reducers: {
        setBalances: (state, action: PayloadAction<any>) => {
            state.balances = {
                data: action.payload,
                error: false
            };
        },
        resetBalances: (state) => {
            state.balances = {
                data: {},
                error: false
            };
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
export const { resetBalances, setBalances } = balancesSlice.actions;
export const walletAsyncActions = { fetchBalancesSMC };
const { reducer: balancesReducer } = balancesSlice;
export default balancesReducer;

