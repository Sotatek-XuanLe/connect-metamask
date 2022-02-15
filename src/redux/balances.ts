import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: any = {
  balances:{
    data:{}
  }
};
export const balancesSlice = createSlice({
  name: "app/balances",
  initialState : initialState,
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
});
export const { resetBalances, setBalances } = balancesSlice.actions;
const { reducer: balancesReducer } = balancesSlice;
export default balancesReducer;

