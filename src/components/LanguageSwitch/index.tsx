import React, { useMemo, useState } from "react";
import Select2 from "../../base/Select2";
import EnFlag from "../../assets/img/icon//en.png";
import KoreaFlag from "../../assets/img/icon//ko.png";
import VnFlag from "../../assets/img/icon//vn.png";
import i18n from "../i18n";
import classnames from "classnames/bind";
import styles from "../LanguageSwitch/LanguageSwitch.module.scss";
import { setOneLocalStorage } from "../../config/storage";
import styled from "styled-components";
import _ from 'lodash'
export const TYPE_FILTER = [
  { value: "vn", label: "Tiếng Việt", src: VnFlag },
  { value: "en", label: "English", src: EnFlag },
  { value: "ko", label: "한국어", src: KoreaFlag },
];

const cx = classnames.bind(styles);

const LanguageSwitch = () => {
  const [type, setType] = useState({ value: "vn", label: "Tiếng Việt", src: VnFlag });
  const handleChangeType = (value: any): void => {
    setType(value);
    i18n.changeLanguage(value.value);
    setOneLocalStorage("locale", value.value);
  };
  const getIconFlag = useMemo(() => {
    const valueFlag: any = _.filter(TYPE_FILTER, item => {
      return item.value === type.value;
    });
    return valueFlag[0].src ?? VnFlag;
  }, [handleChangeType]);
  return (
    <>
      <SLanguage>
        <Select2
          options={TYPE_FILTER}
          option={type}
          onClick={handleChangeType}
          backGroundTransparent={true}
          icon={getIconFlag}
        />
      </SLanguage>
    </>
  );
};
export default LanguageSwitch;
const SLanguage = styled.div`
  margin: 0 30px;
`
