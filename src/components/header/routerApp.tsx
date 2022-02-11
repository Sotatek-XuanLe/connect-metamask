import styled from "styled-components";
import i18n from '../i18n/index';
import { useTranslation } from "react-i18next";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const RouterApp = () => {
    const { t } = useTranslation();
    return (
        <>
            <Switch>
                <Route path="/">
                </Route>
                <Route path="/">
                </Route>
            </Switch>
        </>
    )
}
export default RouterApp;