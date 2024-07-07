import React, { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FaHome,
  FaUser,
  FaFileContract,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaFileAlt,
} from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
const leftMenuItems = [
  { label: "Home", path: "/", icon: <FaHome size={20} /> },
  { label: "Jobs", path: "/jobs", icon: <MdOutlineWorkOutline size={20} /> },
  { label: "Employees", path: "/employees", icon: <FaUsers size={20} /> },
  {
    label: "Contracts",
    path: "/contracts",
    icon: <FaFileContract size={20} />,
  },

  { label: "Profile", path: "/profile", icon: <FaUser size={20} /> },
  {
    label: "Terms & Conditions",
    path: "/terms-and-conditions",
    icon: <FaFileAlt size={20} />,
  },
];

const rightMenuItems = [
  { label: "Login", path: "/login", icon: <FaSignInAlt size={20} /> },
  { label: "Register", path: "/register", icon: <FaUserPlus size={20} /> },
];

type MenuItemLinkProps = {
  to: string;
  onClick: () => void;
  icon?: JSX.Element;
  children: React.ReactNode;
};

const MenuItemLink: React.FC<MenuItemLinkProps> = ({
  to,
  onClick,
  icon,
  children,
}) => (
  <MenuItem
    onClick={onClick}
    component={Link}
    to={to}
    sx={{ display: "flex", alignItems: "center", gap: 2 }}
  >
    {icon}
    <span>{children}</span>
  </MenuItem>
);

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {leftMenuItems.map(({ label, path, icon }) => (
            <Button
              key={path}
              color="inherit"
              component={Link}
              to={path}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {icon}
              {label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {rightMenuItems.map(({ label, path, icon }) => (
            <Button
              key={path}
              color="inherit"
              component={Link}
              to={path}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {icon}
              {label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {leftMenuItems.map(({ label, path, icon }) => (
              <MenuItemLink
                key={path}
                to={path}
                onClick={handleMenuClose}
                icon={icon}
              >
                {label}
              </MenuItemLink>
            ))}
            {rightMenuItems.map(({ label, path, icon }) => (
              <MenuItemLink
                key={path}
                to={path}
                onClick={handleMenuClose}
                icon={icon}
              >
                {label}
              </MenuItemLink>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Navbar);
