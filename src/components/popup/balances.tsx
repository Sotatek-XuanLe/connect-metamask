import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BigNumber from "bignumber.js";
import { LIST_TOKEN } from 'src/const';
import { useCallback, useEffect, useState } from 'react';
// import { useAppDispatch, useBalances, useLoading } from 'src/store/hook';
import { minusZero, stringFromBigNumber, stringFromBigNumberRate } from 'src/helper/bignumber';
export interface RawToken {
    address: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}
interface Props {
    showPopup: any;
}

const BalancesList = (prop: Props) => {
    const onSelectCurrency = prop;
    const { t } = useTranslation();
    const lstBalances : any = [];
    const [tokens] = useState<any[]>(LIST_TOKEN);
    // const loading = useLoading();

    const renderBalance = (
        balance: string,
        itemDecimals: number,
        balanceStr: string
    ) => {
        const str = stringFromBigNumberRate(new BigNumber(balance), itemDecimals, 6)
        if (parseFloat(str) === 0) {
            return "0"
        }

        if (parseFloat(str) < 0.000001) {
            return "<0.000001";
        }
        if (str.indexOf(".") > 0) {
            return minusZero(str);
        }

        return str;
    };

    const renderItem = useCallback((item: RawToken, index) => {
        console.log(lstBalances, 'lstBalances 1');
        if (lstBalances && lstBalances.length) {
            console.log(lstBalances, 'lstBalances 2');

        }
        // const lpToken: any = lstBalances[item.address];
        // console.log(lpToken,'lp token');
        // const lpFormat = stringFromBigNumber(
        //     new BigNumber(lstBalances),
        //     item.decimals,
        //     item.decimals
        // )
        // const lpStr: any =
        //     lpFormat.length > 9 ? lpFormat.slice(0, 9) + "..." : lpFormat;
        return (
            <>
                {
                    <SBlances key={index} onClick={() => onSelectCurrency}>
                        <SBalancesList>
                            <SBalancesSymbol>
                                <SBlancesLogo src={item.logoURI}></SBlancesLogo>
                                <SDivSymbol>
                                    <SBalancesNameSymbol>
                                        {item.symbol}
                                    </SBalancesNameSymbol>
                                    <SBalancesName>
                                        {item.name}
                                    </SBalancesName>
                                </SDivSymbol>


                            </SBalancesSymbol>
                            <SBalancesLp>
                                {/* {
                                    loading && !!loading ?
                                        <SLoadingSVG
                                            className={"cirle-times"}
                                            viewBox="0 0 24 24"
                                            stroke="white"
                                        >
                                            <path
                                                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
                                                stroke-width="2.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </SLoadingSVG>
                                        :
                                        <>
                                            1
                                        </>
                                } */}
                                {renderBalance("1", item.decimals, "11111")}
                            </SBalancesLp>
                        </SBalancesList>
                    </SBlances>
                }
            </>
        )
    }, [lstBalances, prop.showPopup])
    return (
        <>
            <STitleBalances>
                {t('Select A Token')}
            </STitleBalances>
            {
                tokens.length > 0 &&
                tokens.map((item, index) => {
                    return renderItem(item, index);
                })
            }

        </>
    )

};
const SBlances = styled.div`
    
`
const STitleBalances = styled.div`
    font: 24px;
    color:#fff;
`
const SBalancesList = styled.div`
    display: flex;
    justify-content: space-between;
    padding:15px 0;    
    cursor: pointer;
`
const SBlancesLogo = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
`
const SDivSymbol = styled.div`
    margin-left: 20px;
    width: 100%;
    display: block;
`;
const SBalancesSymbol = styled.div`
    display: flex;
`
const SBalancesNameSymbol = styled.div`
    font-size: 16px;
    font-weight: 400;
    color:#fff;
`

const SBalancesName = styled.div`
    font-size: 12px;
    display: block;
    font-weight: 400;
    color:#fff
`
const SBalancesLp = styled.div`
    
`
const SLoadingSVG = styled.svg`
  width: 15px;
  height: 15px;
`;
export default BalancesList;
