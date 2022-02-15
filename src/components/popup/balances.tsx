import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import BigNumber from "bignumber.js";
import { LIST_TOKEN } from 'src/const';
import { useCallback, useEffect, useState } from 'react';
// import { useAppDispatch, useBalances, useLoading } from 'src/store/hook';
import { minusZero, stringFromBigNumber, stringFromBigNumberRate } from 'src/helper/bignumber';
import { useAddress, useBalances } from 'src/store/hook';
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
    isLoadding: boolean;
    hidePopup:any;
}

const BalancesList = (prop: Props) => {
    const onSelectCurrency = prop;
    const { t } = useTranslation();
    const [tokens] = useState<any[]>(LIST_TOKEN);
    const balances = useBalances();
    const address = useAddress();
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
        let _balance = balances[item.address];
        let _balanceStr = stringFromBigNumber(
            new BigNumber(_balance),
            item.decimals,
            item.decimals
        );
        let balanceStr =
            _balanceStr.length > 9 ? _balanceStr.slice(0, 9) + "..." : _balanceStr;
        return (
            <>
                {
                    <SBlances key={index} onClick={prop.hidePopup}>
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
                                {
                                    !!prop.isLoadding ?
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
                                        {!address ? 0 : renderBalance(_balance, item.decimals, balanceStr)}
                                        </>
                                }
                            </SBalancesLp>
                        </SBalancesList>
                    </SBlances>
                }
            </>
        )
    }, [balances, prop.showPopup])
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
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const SLoadingSVG = styled.svg`
  width: 15px;
  height: 15px;
  animation: ${rotate} 2s linear infinite;


`;
export default BalancesList;
