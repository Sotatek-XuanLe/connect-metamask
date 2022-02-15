import { Button, Dialog, DialogProps, makeStyles } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import CloseIcon from '../../assets/img/icon/close-icon.svg'
interface Props extends Omit<DialogProps, "onClose"> {
  onClose: () => void;
  icon?: string;
  action?: string;
  onAction?: () => void;
  isDisable?: boolean;
  width?: string;
  isReceivePU?: boolean;
}

const CustomDialog = React.memo((props: Props) => {
  const useStyles = makeStyles({
    root: {
      "& .MuiDialog-paper": {
        padding: "40px 25px",
        position: "relative",
        width: props.width ? props.width : "400px",
        color: "#ffffff",
      },
    },
    title: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "29.26px",
    },
    content: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "18px",
      color: "rgba(255, 255, 255, 0.6)",
    },
    btn: {
      textTransform: "none",
      height: 36,
      color: "#100F24",
      background: "#71CEF3",
      borderRadius: "5px",
    },
    disable: {
      textTransform: "none",
      height: 36,
      color: "#100F24",
      background: "#333 !important",
      borderRadius: "5px",
    },
  });

  const classes = useStyles();
  const {
    title,
    children,
    onClose,
    icon,
    className,
    action,
    onAction,
    isDisable,
    isReceivePU,
    ...rest
  } = props;
  return (
    <Dialog
      {...rest}
      className={className + " " + classes.root}
      onClose={onClose}
    >
      <SDivTitle isReceivePU={isReceivePU ?? false}>
        <STitle>{title}</STitle>
        <SIcon onClick={onClose} src={CloseIcon} />
      </SDivTitle>
      <div className={classes.content}>{children}</div>
      {action && (
        <Button
          variant="contained"
          onClick={onClose}
          className={isDisable ? classes.disable : classes.btn}
          disabled={isDisable}
        >
          {action}
        </Button>
      )}
    </Dialog>
  );
});

export default CustomDialog;

const SIcon = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;

`;

const SDivTitle = styled.div<{ isReceivePU: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.isReceivePU ? "#171a2e" : "")};
  margin: ${(props) => (props.isReceivePU ? "-20px -20px 0 -20px" : "")};
  padding: ${(props) => (props.isReceivePU ? "20px 20px 0 20px" : "")};
  font-size:20px;
  line-height: 30px;
`;

const STitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color:#e3e3e3;
  line-height: 30px;
  @media (max-width: 768px) {
    font-size:18px !important;
    }
`;
