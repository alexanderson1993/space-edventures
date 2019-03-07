import React, { lazy } from "react";
import { Router } from "@reach/router";
import { Auth, Content } from "../components";
const Menu = lazy(() => import("../routes/admin/menu"));
const CoppaVerify = lazy(() => import("../routes/admin/coppaVerify"));
const Ranks = lazy(() => import("../routes/admin/rank"));
const RankCreate = lazy(() => import("../routes/admin/rank/create"));
const RankEdit = lazy(() => import("../routes/admin/rank/edit"));

export default () => {
  return (
    <Auth roles={["admin"]}>
      <Content>
        <div>HELLO</div>
        <Router>
          <Menu path="/admin" />
          <Ranks path="/admin/rank" />
          <RankCreate path="/admin/rank/create" />
          <RankEdit path="/admin/rank/:id" />
          <CoppaVerify path="/admin/verify" />
        </Router>
      </Content>
    </Auth>
  );
};
