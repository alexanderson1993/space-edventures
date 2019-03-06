import React from "react";
import { Link } from "../../components";

const Menu = () => (
  <div>
    <h1>Admin Menu</h1>
    <ul>
      <li>
        <Link to="/admin/coppaVerify">COPPA Account Verification</Link>
      </li>
      <li>
        <Link to="/admin/rank">Ranks</Link>
      </li>
    </ul>
  </div>
);
export default Menu;
