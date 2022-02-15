import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { useHistory } from "react-router";
import Loadding from "src/base/Loadding";
import { useEffect, useState } from "react";

const NotFound = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [loadding, setLoading] = useState(false);
    const goBack = (evt: any) => {
        //  remove and block event in safari
        evt.preventDefault();
        evt.stopPropagation();
        // end
        history.push("/");
    };
    const componentDidMount = () => {
        setTimeout(()   => {
            setLoading(true)
        }, 200);
    }
    useEffect(() => {
        componentDidMount();
    }, [loadding]);
    console.log(loadding, 'loadding');

    return (
        <>
            <SDivNotFound>
                 {
                    loadding ? <Loadding />
                        :
                        <SBtnGoBack onClick={goBack}>
                            {t('Go back')}
                        </SBtnGoBack>
                } 

               
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
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100%;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`
export default NotFound;