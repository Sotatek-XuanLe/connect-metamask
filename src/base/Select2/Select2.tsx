import React, { useRef, useState, useEffect } from "react";
import styles from "./Select2.module.scss";
import classnames from "classnames/bind";
import { KeyboardArrowDownTwoTone } from "@material-ui/icons";
import EnFlag from "../../assets/img/icon/en.png";
import KoreaFlag from "../../assets/img/icon//ko.png";
import VnFlag from "../../assets/img/icon//vn.png";
import _ from "lodash";
import useOnClickOutside from "../../helper/useClickOutside";
import { getLocalStorage } from "../../config/storage";
import styled from "styled-components";
const cx = classnames.bind(styles);

export const TYPE_FILTER = [
  { value: "vn", label: "Tiếng Việt", src: VnFlag },
  { value: "en", label: "English", src: EnFlag },
  { value: "ko", label: "한국어", src: KoreaFlag },
];
export interface ISelect {
  value: any;
  label: string;
  src: string;
}
interface Props {
  size?: "md" | "lg";
  variant?: "contained" | "raw";
  options: ISelect[];
  option: ISelect;
  onClick: (value: ISelect) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode | null;
  className?: string;
  backGroundTransparent?: boolean;
  noPadding?: boolean;
  captionBold?: boolean;
  icon?: string;
}

const Select2: React.FC<Props> = ({
  size = "md",
  variant = "contained",
  options,
  option,
  onClick,
  startAdornment,
  //endAdornment = <ArrowDown />,
  className,
  backGroundTransparent = false,
  noPadding = false,
  captionBold = false,
  icon,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [img, setImg] = useState("");
  const ref = useRef<any>();
  const locale = getLocalStorage("locale");
  useOnClickOutside(ref, () => setOpen(false));

  const handleClick = () => {
    setOpen(!open);
  };

  const returnSize = (size: string) => {
    switch (size) {
      case "lg":
        return "lg";
      case "md":
        return "md";
      default:
        break;
    }
  };

  const returnVariant = (variant: string) => {
    switch (variant) {
      case "contained":
        return "contained";
      case "raw":
        return "raw";
      default:
        break;
    }
  };
  useEffect(() => {
    const img = _.filter(TYPE_FILTER, (item: any) => {
      return item.value === locale;
    });
    if (img.length > 0) {
      setImg(img[img.length - 1].src);
    } else {
      setImg(TYPE_FILTER[0].src);
    }
  }, [locale]);
  return (
    <>
      <div className={cx("container", className)} ref={ref}>
        <div
          className={cx(
            "select",
            returnVariant(variant),
            returnSize(size),
            backGroundTransparent && "bg-transparent",
            noPadding && "no-padding"
          )}
          key={option.value}
          onClick={handleClick}
        >
          <SEndAdornment>
            <SImg
              src={img}
              className={cx("img-flag")}
            />
            <KeyboardArrowDownTwoTone
              fontSize={"medium"}
              style={{ color: "rgba(229, 231, 235)", opacity: "0.5" }}
            />
          </SEndAdornment>
        </div>

        {open && (
          <div className={cx("option", returnSize(size))}>
            {options.map((item) => (
              <p
                key={item.value}
                className="option-item"
                onClick={() => {
                  onClick(item);
                  handleClick();
                }}
              >
                <img width="20px" height="20px" src={item.src} alt="" />
                {item.label}
              </p>
            ))}
          </div>
        )}
      </div>
      {open && <div className={cx("overlay")} />}
    </>
  );
};

const SImg = styled.img`
  width: 20px;
  height: 20px;
`;
const SEndAdornment = styled.div`
  padding: 6px 10px;
`
export default Select2;
