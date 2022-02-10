import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect, useMemo, useState } from "react";
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): any => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAddress = () => {
  return useAppSelector((state: RootState) => state.user.address);
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
  return useAppSelector((state: RootState) => parseFloat(state.user.coin));
};