import React from "react";
import styled from "@emotion/styled";
import { transparentize } from "polished";
import {
  FaSpaceShuttle,
  FaUserSecret,
  FaIdBadge,
  FaHome,
  FaFeatherAlt,
  FaCogs,
  FaDollarSign
} from "react-icons/fa";
import { Link } from "../../../components";

const Sidebar = styled("div")`
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
  cursor: pointer;
  transition: all 0.25s ease !important;
  background-color: rgba(255, 255, 255, 0);
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
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
    url: "/director"
  },
  {
    label: "Simulators",
    icon: FaSpaceShuttle,
    url: "/director/simulators"
  },
  {
    label: "Flight Types",
    icon: FaFeatherAlt,
    url: "/director/flightTypes"
  },
  {
    label: "Missions",
    icon: FaUserSecret,
    url: "/director/missions"
  },
  {
    label: "Badges",
    icon: FaIdBadge,
    url: "/director/badges"
  },
  {
    label: "Billing",
    icon: FaDollarSign,
    url: "/director/billing"
  },
  {
    label: "Settings",
    icon: FaCogs,
    url: "/director/settings"
  }
];

const SidebarComp = props => {
  return (
    <Sidebar {...props}>
      <Sticky>
        {sidebarLinks.map(l => (
          <SidebarLink {...props} key={l.label} to={l.url}>
            <l.icon /> {l.label}
          </SidebarLink>
        ))}
      </Sticky>
    </Sidebar>
  );
};

export default SidebarComp;
