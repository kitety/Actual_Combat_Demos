import React from "react";
import ReactDom from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import history from "./core/history";
import { getRoutes } from "./core/routes";
// import { renderRoutes } from "react-router-config";

let routes = getRoutes();
ReactDom.render(
  <Router history={history}>{renderRoutes(routes)}</Router>,
  document.getElementById("root")
);

function renderRoutes(routes) {
  return routes.map(
    (
      { path, exact, component: RouteComponent, routes: childrenRoutes = [] },
      index
    ) => {
      return (
        <Route
          key={index}
          path={path}
          exact={exact}
          render={(routeProps) => (
            <RouteComponent {...routeProps}>
              <Switch>{renderRoutes(childrenRoutes)}</Switch>
            </RouteComponent>
          )}
        ></Route>
      );
    }
  );
}
/**
 * 渲染组件三种方式
 * component--不可以传参 render--可以传参 children
 */
