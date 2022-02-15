import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useMemo, useState } from "react";
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): any => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useLoading = () =>{
//   return useAppSelector((state: RootState) => state.balances.error ?? false);
// }
// export const useBalances = () => {
//   return useAppSelector((state: RootState) => state.balances?.balances
//   )
// }
export const useAuthRouter = () => {
  return useAppSelector((state: RootState) => state.router.router ?? false);
};
export const useBoolean = (
  initValue: boolean = false
): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(initValue);

  const { setTrue, setFalse } = useMemo(
    () => ({
      setTrue: () => setValue(true),
      setFalse: () => setValue(false),
    }),
    []
  );
  return [value, setTrue, setFalse];
};
export const useCoin = () => {
  return useAppSelector((state: RootState) => parseFloat(state.user?.coin ?? 0));
};
