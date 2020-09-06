import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import "./App.css";
import { useSelector, Provider } from "react-redux";
import Login from "./views/Login";
import CreateConditionalTrade from "./views/CreateConditionalTrade";
import store from "./store";
import {
  DASHBOARD_ROUTE,
  CREATE_CONDITIONAL_TRADE_ROUTE,
  LOGIN_ROUTE,
  COMPLETED_TRADE_ROUTE,
  INSTANT_EXCHANGE_ROUTE,
  ACTIVE_TRADE_ROUTE,
  EXPIRED_TRADE_ROUTE,
} from "./routes";
import CompletedTradesView from "./views/CompletedTradesView";
import InstantExchange from "./views/InstantExchange";
import ActiveTradesView from "./views/ActiveTradesView";
import ExpiredTradeView from "./views/ExpiredTradeView";
import Dashboard from "./views/Dashboard";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const loginStatus = useSelector((state) => state.user.status);

  return (
    <Route
      {...props}
      component={(routerProps) => {
        if (!loginStatus) {
          return <Redirect to={LOGIN_ROUTE} />;
        }

        return <Component {...routerProps} />;
      }}
    />
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute
            exact
            path={CREATE_CONDITIONAL_TRADE_ROUTE}
            component={CreateConditionalTrade}
          />
          <ProtectedRoute
            exact
            path={COMPLETED_TRADE_ROUTE}
            component={CompletedTradesView}
          />
          <ProtectedRoute
            exact
            path={INSTANT_EXCHANGE_ROUTE}
            component={InstantExchange}
          />
          <ProtectedRoute
            exact
            path={ACTIVE_TRADE_ROUTE}
            component={ActiveTradesView}
          />
          <ProtectedRoute
            exact
            path={EXPIRED_TRADE_ROUTE}
            component={ExpiredTradeView}
          />
          <Route exact path={DASHBOARD_ROUTE} component={Dashboard} />
          <ProtectedRoute component={() => <Redirect to={DASHBOARD_ROUTE} />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

global.Web3 = require("web3");

export default App;
