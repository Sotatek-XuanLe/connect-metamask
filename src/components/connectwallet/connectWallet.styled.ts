import styled from "styled-components";
export const SDivConnect = styled.div`
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #131421;
    border-radius: 50px;
    color: #bfbfbf;
`
export const SDivLoader = styled.div`
  border: 2px solid #02d394;
  border-radius: 50%;
  border-top: 2px solid #333;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
export const SAddress = styled.div`
    font-size:14px;
    background: #090b13 !important;
    color: #bfbfbf;
    font-weight: 400;
    padding: 5px 10px;
    border-radius: 50px;
    font-size: 14px;
`
export const SCoin = styled.div`
    font-size:14px;
    margin-left:10px;
`
export const SDivLogout = styled.div`
  background: #262a47 !important;
  padding: 10px;
  border-radius: 50px;
  font-weight: 400;
  color: #fff;
  cursor:pointer;
  font-size:14px;
  margin-left:10px;
`
export const SBtnConnect = styled.div`
    font-size: 18px !important;
    line-height: 27px;
    color: #fff !important;
    padding: 10px;
    border-radius: 50px !important;
    background-color: rgba(76,255,163,0.2);
    width: 190px;
    cursor:pointer;
    @media screen and (max-width: 767px) {
      width:30%;
    }
`
export const SBtnConnectPopup = styled.div`
  color: #ffffff;
    opacity: 0.7;
    cursor: pointer;
    height: 56px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    background: rgba(23,26,46,1);
    border: 1px solid rgba(23,26,46,1);
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-weight: 500;
    line-height: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 0 15px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
`