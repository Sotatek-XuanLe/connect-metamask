import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Loadding from "src/base/Loadding";
import { useAuthRouter } from "src/store/hook";
import NotFound from "../notfound";
import Swap from "../swap";
const RouterApp = () => {
    const isRouter = useAuthRouter();
    return (
        <>
            {
                isRouter ?
                < Switch >
                    {/* default router  */}
                    <Route exact path="/">
                        <Redirect path="/" to="/home" />
                    </Route>
                    {/* exact router */}
                    <Route path="/home" exact />
                    <Route path="/exchange" exact component={Swap} />
                    <Route path="/pool" exact />
                    {/* not exact router */}
                    <Route path="/error" component={NotFound} exact={false} />
                    <Redirect from="*" to="/error" />
                    {/* loading */}
                </Switch >
                :
                <NotFound />
            }

        </>
    )
}
export default RouterApp;