import CustomDialog from "src/base/Dialog";
import { useAppDispatch, useBalances, useBoolean } from "src/store/hook";
import BalancesList from "../popup/balances";
import styled from 'styled-components';
import { useEffect } from "react";
import { resetBalances, setBalances } from "src/redux/balances";
// import { walletAsyncActions } from "src/redux/balances";
import { LIST_TOKEN, LOCAL_STORAGE_ADDRESS } from "src/const";
import { getLocalStorage } from "src/config/storage";
import { syncUserWalletBalance } from "src/helper/funcition";
import store from "src/store/store";
import { getBlancesAll } from "src/helper/contract";
const Swap = () => {
    const [openPopup, showPopup, hidePopup] = useBoolean();
    const address = getLocalStorage(LOCAL_STORAGE_ADDRESS);
    const dispatch = useAppDispatch();
    const balances = useBalances();
    const [isLoadding, showLoadding, hideLoadding] = useBoolean();
    const setValue = () =>{
        hidePopup()
    };
    //get Balances
    useEffect(() => {
        (async () => {
            showLoadding();
            if (address) {
                await getBlancesAll(LIST_TOKEN).then((result) => {
                    if (result) {
                        hideLoadding();
                        store && store.dispatch(setBalances(result));
                    }
                }).catch((err) => {
                    hideLoadding();
                })
            } else {
                hideLoadding();
                dispatch(resetBalances());
            }
        })();
    }, [])
    return (
        <>
            <SDiv>
                <SBtnBalances onClick={showPopup} >Balances</SBtnBalances>
                <CustomDialog
                    open={openPopup}
                    onClose={() => {
                        hidePopup();
                    }}
                    style={{ zIndex: 9999 }}
                    fullWidth
                    maxWidth={'sm'}
                >
                    <BalancesList isLoadding={isLoadding} showPopup={openPopup} hidePopup={setValue}></BalancesList>

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