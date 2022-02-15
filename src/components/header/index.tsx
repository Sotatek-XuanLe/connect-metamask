import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { URL_APP, GREEN } from '../../const/index';
const Header = () => {
    const { t } = useTranslation();
    const NavBar = (to: string, id: string, text: string) => {
        const { t } = useTranslation();
        return (
            <NavLink
                key={to}
                to={to}
                id={id}
                activeClassName="active"
                activeStyle={{
                    color: GREEN // Use const for color because tailwind reload very slow with NavBar Active state
                }}
            >
                {t(text)}
            </NavLink>
        )
    };
    return (
        <>
            {

                URL_APP?.map((item) => {
                    return <SNavBar>{NavBar(item.to, item.id, item.text)}</SNavBar>
                })
            }
        </>
    )
}
const SNavBar = styled.div`
    font-size:14px;
    display: flex;
    padding: 0 10px;
    a{
        color:#bfbfbf;
        text-decoration: none;
        font-weight: 500;
    }
`
export default Header;