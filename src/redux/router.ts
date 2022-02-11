import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState = {
    router: false
};
export const routerSlice = createSlice({
    name: "router",
    initialState,
    reducers: {
        setAuthRouter: (state, action: PayloadAction<boolean>) => {
            state.router = action.payload;
        },

    },
});
export const { setAuthRouter } = routerSlice.actions;
const { reducer: routerReducer } = routerSlice;
export default routerReducer;
