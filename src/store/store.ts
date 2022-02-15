import { configureStore } from "@reduxjs/toolkit";
import balancesReducer from "src/redux/balances";
import routerReducer from "src/redux/router";
import userReducer from "src/redux/user";

const store = configureStore({
  reducer: {
    user: userReducer,
    router: routerReducer,
    balances: balancesReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;