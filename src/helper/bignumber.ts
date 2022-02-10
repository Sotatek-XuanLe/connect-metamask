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
// for display purpose only, don't create a custom here, create a new one extends this function
export const validationMaxDecimalsNoRound = (
  number: string,
  maxDecimal: number
) => {
  if (number && parseFloat(number) < 0.000001) {
    return "< 0.000001";
  }
  function join(wholeNumber: string, decimals: string) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join(".");
  }
  const bigNum = new BigNumber(number);

  const algoFormat = Intl.NumberFormat("en-US");
  let [wholeNumber, decimals] = bigNum.toFixed().split(".");

  wholeNumber = algoFormat.format(parseFloat(wholeNumber));

  if (decimals) {
    if (decimals.length > maxDecimal) {
      decimals = decimals.substr(0, maxDecimal);
    }
    return join(wholeNumber, decimals);
  }

  return wholeNumber;
};