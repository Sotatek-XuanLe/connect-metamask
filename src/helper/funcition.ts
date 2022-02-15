import { LIST_TOKEN } from "src/const";
import { resetBalances, setBalances } from "src/redux/balances";
import store from "src/store/store";
import { getBlancesAll } from "./contract";

export const getShortAddress = (address: string) => {
  if (address.length === 0) return "";
  return address?.slice(0, 5) + "..." + address?.slice(-4);
};
export const syncUserWalletBalance = async () => {
  await getBlancesAll(LIST_TOKEN).then((result) => {
    if(result){
      store && store.dispatch(setBalances(result));
    }
  }).catch((err) => {
    store && store.dispatch(resetBalances());
  })
}
