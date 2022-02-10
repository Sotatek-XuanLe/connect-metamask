import BigNumber from "bignumber.js";
const TEEN = 10;
// chia decimals
export const divDecimalsNumber = (number: any, decimals: number) => {
  return +new BigNumber(number).div(new BigNumber(TEEN).pow(decimals));
};
// nhân decimals
export const timesDecimalsNumber = (number: number, decimals: number) => {
  return +new BigNumber(TEEN).pow(decimals).times(+number);
};

export const timesNumber = (numberA: number, numberB: number) => {
  return +new BigNumber(numberA).times(+numberB);
};

export const divNumber = (numberA: number, numberB: number) => {
  return +new BigNumber(numberA).div(+numberB);
};

export const timesDecimalsBigNumber = (number: any, decimals: number): BigNumber => {
  return new BigNumber(number).times(new BigNumber(10).pow(decimals))
  // return new BigNumber(TEEN).pow(decimals).times(number);
};

export const divDecimalsBigNumber = (number: any, decimals: number): BigNumber => {
  return new BigNumber(number).div(new BigNumber(TEEN).pow(decimals));
};