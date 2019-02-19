import React from "react";
import { Link } from "../../components";

const Menu = () => (
  <div>
    <h1>Admin Menu</h1>
    <ul>
      <li>
        <Link to="/admin/verify">COPPA Account Verification</Link>
      </li>
    </ul>
  </div>
);
export default Menu;
