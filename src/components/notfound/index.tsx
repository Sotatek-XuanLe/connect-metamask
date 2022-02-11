import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { useHistory } from "react-router";

const NotFound = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const goBack = (evt: any) => {
        //  remove and block event in safari
        evt.preventDefault();
        evt.stopPropagation();
        // end
        history.push("/");
    };
    return (
        <>
            <SDivNotFound>
                <SBtnGoBack onClick={goBack}>
                    {t('Go back')}
                </SBtnGoBack>
            </SDivNotFound>

        </>
    )
};
const SDivNotFound = styled.div`
    width: 100%;
    height: 100%;
    background: #333 !important;
    min-height: 100vh;
`
const SBtnGoBack = styled.div`
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 10px;
    background: #333 !important;
    color:#fff;
    font-size:14px;
`
export default NotFound;