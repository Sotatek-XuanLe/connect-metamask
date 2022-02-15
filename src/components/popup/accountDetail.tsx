import CustomDialog from '../../base/Dialog';
import styled from 'styled-components';
import React, { useMemo } from "react";
import { getLocalStorage } from 'src/config/storage';
import { LOCAL_STORAGE_ADDRESS,LOCAL_STORAGE_NETWORK } from 'src/const';
import { useTranslation } from 'react-i18next';
import { isConnectedByWalletConnect } from 'src/config/walletConnect';
import { getShortAddress } from 'src/helper/funcition';
import CopyHelper from 'src/base/Copy';
// import { useAddress } from 'src/store/hook';
import Typography from 'src/base/Typography';
import { ExternalLink as LinkIcon } from "react-feather";
import ExternalLink from 'src/base/ExternalLink';
import { getExplorerLink } from 'src/config/web3';
interface Props {
    open: boolean;
    onClose: any;
    address: string;
    txhash: number;
}

const AccountDetail = ({ open, onClose, address, txhash, ...rest }: Props) => {
    const network: any = getLocalStorage(LOCAL_STORAGE_NETWORK);
    const addressUser =  getLocalStorage(LOCAL_STORAGE_ADDRESS);
    const { t } = useTranslation();
    const formatConnectorName = useMemo(() => {
        return (
            <SModalConnectWithNetWork>
                {isConnectedByWalletConnect()
                    ? t("Connected to WalletConnect")
                    : t("Connected to Metamask")}
            </SModalConnectWithNetWork>
        );
    }, [network, t]);
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                style={{ zIndex: 9999 }}
                fullWidth
                maxWidth={'sm'}
            >

                <STitle>Account Details</STitle>
                <SNetWork>
                    {formatConnectorName}
                </SNetWork>
                {address &&
                    <SAddress>{getShortAddress(address)}</SAddress>
                }
                <SRinkeby>

                    <SViewTxHash>
                        {txhash && (
                            <ExternalLink
                                color="blue"
                                startIcon={<LinkIcon size={16} />}
                                href={getExplorerLink(Number(txhash), addressUser, "address")}
                            >
                                {t`View on explorer`}
                            </ExternalLink>
                        )}
                    </SViewTxHash>
                    <CopyHelper toCopy={addressUser}>
                        <Typography variant="sm" weight={400}>{t`Copy Address`}</Typography>

                    </CopyHelper>
                </SRinkeby>
            </CustomDialog>
        </>
    )
}
const STitle = styled.div`
    color:#fff !important;
    text-align: center;
    font-size:18px;
`
const SAddress = styled.div`
    background: #090b13;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    border-radius: 50px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 10px;
    margin-bottom: 20px;
`
const SNetWork = styled.div`
    margin-top: 10px;
`
const SModalConnectWithNetWork = styled.div`
    color:#fff !important;
    padding: 10px 0;

`
const SRinkeby = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    color:#4cffa3;
    cursor: pointer;
    svg{
        width:16px !important;
        height:16px !important;
        margin-left:5px;
        display: block;

  }
`
const SViewTxHash = styled.div`
    a{
        display: flex;
        justify-content: center;
        color:#4cffa3;
        text-decoration: none;
        margin-left:5px;

    }
    svg{
        width:16px !important;
        height:16px !important;
        margin-left:5px;
        display: block;

  }
`
export default AccountDetail