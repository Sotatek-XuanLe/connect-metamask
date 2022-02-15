import { Button, Dialog, DialogProps, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    "& .MuiDialog-paper": {
      position: "relative",
      width: "45vh",
      color: "#ffffff",
    },
  },
  closeBtn: {
    position: "absolute",
    top: 30,
    right: 30,
    cursor: "pointer",
    zIndex: 9999,
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

interface Props extends Omit<DialogProps, "onClose"> {
  onClose: () => void;
  icon?: string;
  action?: string;
  onAction?: () => void;
  isDisable?: boolean;
}

const CustomDialog = React.memo((props: Props) => {
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
    ...rest
  } = props;
  return (
    <Dialog
      {...rest}
      className={className + " " + classes.root}
      onClose={onClose}
    >
      <div
        className={classes.closeBtn}
        onClick={onClose}
        style={{ cursor: "pointer" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.30664 1.30664L12.6938 12.6938"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.30664 12.6938L12.6938 1.30666"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={classes.title}>{title}</div>
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
