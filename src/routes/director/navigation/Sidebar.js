import React, { useContext } from "react";
import styled from "@emotion/styled";
import { transparentize, darken } from "polished";
import {
  FaSpaceShuttle,
  FaUserSecret,
  FaIdBadge,
  FaHome,
  FaFeatherAlt,
  FaCogs,
  FaDollarSign,
  FaTrafficLight,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";
import { Link, Auth } from "../../../components";
import { CenterContext } from "../../../pages/director";
import { DirectorContext } from "../../../helpers/directorContext";

const Sidebar = styled("div")`
  min-width: 180px;
  border-right: solid 2px rgba(0, 0, 0, 0);
  box-shadow: 5px 0px 5px ${({ color }) => transparentize(0.8, color)};
  background-color: ${({ color }) => transparentize(0.7, color)};
`;
const SidebarLink = styled(Link)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  align-items: center;
  border-bottom: solid 1px ${({ color }) => transparentize(0.7, color)};
  color: ${({ color, disabled }) =>
    disabled ? darken(0.3, color) : color} !important;

  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"} !important;
  transition: all 0.25s ease !important;
  background-color: rgba(255, 255, 255, 0);
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : "rgba(255, 255, 255, 0.2)"};
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Sticky = styled("div")`
  position: sticky;
  top: 0;
`;
const sidebarLinks = [
  {
    label: "Home",
    icon: FaHome,
    url: "",
    roles: ["staff", "director"]
  },
  {
    label: "Flights",
    icon: FaTrafficLight,
    url: "/flights",
    roles: ["director"]
  },
  {
    label: "Simulators",
    icon: FaSpaceShuttle,
    url: "/simulators",
    roles: ["director"]
  },
  {
    label: "Flight Types",
    icon: FaFeatherAlt,
    url: "/flightTypes",
    roles: ["director"]
  },
  {
    label: "Missions",
    icon: FaUserSecret,
    url: "/missions",
    roles: ["director"]
  },
  {
    label: "Badges",
    icon: FaIdBadge,
    url: "/badges",
    roles: ["director"]
  },
  {
    label: "Billing",
    icon: FaDollarSign,
    url: "/billing",
    roles: ["director"]
  },
  {
    label: "Staff",
    icon: FaUsers,
    url: "/staff",
    roles: ["director"]
  },
  {
    label: "Settings",
    icon: FaCogs,
    url: "/settings",
    roles: ["director"]
  }
];

const SidebarComp = props => {
  const center = useContext(CenterContext);
  const director = useContext(DirectorContext);

  return (
    <Sidebar {...props}>
      <Sticky>
        {sidebarLinks.map(l => (
          <Auth key={l.label} roles={l.roles}>
            <SidebarLink {...props} to={`/director/${center.id}${l.url}`}>
              <l.icon /> {l.label}
            </SidebarLink>
          </Auth>
        ))}
        {director.centers.length > 1 && (
          <SidebarLink {...props} to={`/director`}>
            <FaSignOutAlt /> Change Center
          </SidebarLink>
        )}
      </Sticky>
    </Sidebar>
  );
};

export default SidebarComp;
