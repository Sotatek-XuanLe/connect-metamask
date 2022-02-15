import React, { FC } from "react";
// import Typography from "../../components/Typography";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AssignmentReturnOutlinedIcon from "@material-ui/icons/AssignmentReturnOutlined";
import { useTranslation } from "react-i18next";
import useCopyClipboard from "src/config/useCopyClipboard";
import Typography from "../Typography";
import styled from 'styled-components';
interface CopyHelperProps {
  className?: string;
  toCopy: string;
  children?: React.ReactNode;
}

const CopyHelper: FC<CopyHelperProps> = ({ className, toCopy, children }) => {
  const [isCopied, setCopied] = useCopyClipboard();
  const { t } = useTranslation();
  return (
    <SCopy
      onClick={() => setCopied(toCopy)}
    >
      {isCopied && (
        <SCopyText>
          <Typography variant="sm">{t`Copied`}</Typography>
          <SCopyIcon>
            <CheckCircleOutlineIcon width={16} height={16} />
          </SCopyIcon>
        </SCopyText>
      )}
      {!isCopied && (
        <>
          {children}
          <AssignmentReturnOutlinedIcon width="12px" height="12px" />
        </>
      )}
    </SCopy>
  );
};
const SCopy = styled.div`
  display: flex;
  align-items: center;
 
`
const SCopyText = styled.div`
  font-size:12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  svg{
        width:16px !important;
        height:16px !important;
        margin-right:5px;
        display: block;

  }
`
const SCopyIcon = styled.div`
    font-size:12px !important;
 `
export default CopyHelper;
