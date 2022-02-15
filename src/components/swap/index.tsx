import CustomDialog from "src/base/Dialog";
import { useAppDispatch, useBoolean } from "src/store/hook";
import BalancesList from "../popup/balances";
import styled from 'styled-components';
import { useEffect } from "react";
import { resetBalances } from "src/redux/balances";
import { walletAsyncActions } from "src/redux/user";
import { LIST_TOKEN,LOCAL_STORAGE_ADDRESS } from "src/const";
import { getLocalStorage } from "src/config/storage";
const Swap = () => {
    const [openPopup, showPopup, hidePopup] = useBoolean();
    const address =  getLocalStorage(LOCAL_STORAGE_ADDRESS);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (address) {
            console.log(' dispatch balances');
            dispatch(walletAsyncActions.fetchBalancesSMC(LIST_TOKEN));
        } else {
            console.log('not dispatch balances');
            dispatch(resetBalances());
        }
    }, [openPopup, dispatch, address]);
    return (
        <>
            <SDiv>
                <SBtnBalances onClick={showPopup}>Balances</SBtnBalances>
                <CustomDialog
                    open={openPopup}
                    onClose={() => {
                        hidePopup();
                    }}
                    style={{ zIndex: 9999 }}
                    fullWidth
                    maxWidth={'sm'}
                >
                    <BalancesList showPopup={openPopup}></BalancesList>

                </CustomDialog>
            </SDiv>

        </>
    )
};
const SDiv = styled.div`
    padding:10px 0;
`
const SBtnBalances = styled.div`
    width:120px;
    margin: auto;
    background-color: rgba(76,255,163,0.2);
    font-size: 18px !important;
    line-height: 27px;
    color: #fff !important;
    padding: 5px 15px;
    border-radius: 50px;
    cursor: pointer;

`
export default Swap;