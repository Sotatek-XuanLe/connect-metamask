import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import styled from "styled-components";
interface Props {
    isLoadding?: boolean;
}
const Loadding: React.FC<Props> = () => {
    return (
        <>
            {
            <SImgLoadding />
            }
        </>
    );
};
export default Loadding;

const SImgLoadding = styled(CircularProgress)`
    height: 15px!important;
    width: 15px!important;
    color: #ffff !important;
    @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      };
    animation: rotation 2s infinite linear;
`;