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
export const stringFromBigNumber = (
  number: BigNumber | number,
  tokenDecimals: number,
  displayDecimal: number
) => {
  if (new BigNumber(number).isNaN()) {
    return "";
  }

  let format = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: " ",
    fractionGroupSize: 0,
  };

  let s = new BigNumber(10).pow(tokenDecimals);
  let _str1 = new BigNumber(number).div(s); //.toFixed(tokenDecimals);
  let str = new BigNumber(_str1).toFormat(format).toString();
  let arrStr = str.split(".");

  if (arrStr.length == 0) {
    return "";
  }

  if (arrStr.length == 1) {
    return arrStr[0];
  }

  let sub = arrStr[1];
  if (sub.length > displayDecimal) {
    sub = sub.slice(0, displayDecimal);
  }
  if (str && parseFloat(str) < 0.000001) {
    return "< 0.000001";
  }
  return arrStr[0] + "." + sub;
};
export const stringFromBigNumberRate = (
  number: BigNumber | number,
  tokenDecimals: number,
  displayDecimal: number
) => {
  if (new BigNumber(number).isNaN()) {
    return "";
  }

  let format = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: " ",
    fractionGroupSize: 0,
  };

  let s = new BigNumber(10).pow(tokenDecimals);
  let _str1 = new BigNumber(number).div(s);
  let str = new BigNumber(_str1).toFormat(format).toString();
  let arrStr = str.split(".");

  if (arrStr.length == 0) {
    return "";
  }

  if (arrStr.length == 1) {
    return arrStr[0];
  }

  let sub = arrStr[1];
  if (sub.length > displayDecimal) {
    sub = sub.slice(0, displayDecimal);
  }
  return arrStr[0] + "." + sub;
};

export const minusZero = (value: string): string => {
  if (value.charAt(value.length - 1) === "0") {
    const newValue = value.slice(0, value.length - 1);
    return minusZero(newValue);
  } else {
    if (value.indexOf(".") === value.length - 1) {
      return value.slice(0, value.length - 1);
    }
    return value;
  }
};