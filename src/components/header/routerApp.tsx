import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import NotFound from "../notfound";
const RouterApp = () => {
    return (
        <>
            {
                < Switch >
                    {/* default router  */}
                    <Route exact path="/">
                        <Redirect path="/" to="/home" />
                    </Route>
                    {/* exact router */}
                    <Route path="/home" exact />
                    <Route path="/exchange" exact />
                    <Route path="/pool" exact />
                    {/* not exact router */}
                    <Route path="/error" component={NotFound} exact={false} />
                    <Redirect from="*" to="/error" />
                </Switch >
            }

        </>
    )
}
export default RouterApp;