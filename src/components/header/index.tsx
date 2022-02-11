import styled from "styled-components";
import i18n from '../i18n/index';
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
const URL_APP = [
    {
        to: "/swap",
        id: "pool-nav-link",
        text: "Exchange",
    },
    {
        to: "/pool",
        id: "pool-nav-link",
        text: "Pool",
    },
    {
        to: "/farm",
        id: "pool-nav-link",
        text: "Farm",
    }
];
const NavBar = (to: string, id: string, text: string) => {
    return (
        <NavLink key={to} to={to} id={id} activeStyle={{ color: "blue" }}>
            {text}
        </NavLink>
    )
};
const Header = () => {
    const { t } = useTranslation();
    return (
        <>
            {
                URL_APP?.map((item) => {
                    return NavBar(item.to, item.id, item.text);
                })
            }
        </>
    )
}
export default Header;