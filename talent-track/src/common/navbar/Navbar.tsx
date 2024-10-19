import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  FaHome,
  FaFileContract,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { logout, isLoggedIn } from '../../utils/authUtils';

type MenuItem = {
  label: string;
  path: string;
  icon: JSX.Element;
  protected: boolean;
};

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/', icon: <FaHome size={20} />, protected: false },
  {
    label: 'Jobs',
    path: '/jobs',
    icon: <MdOutlineWorkOutline size={20} />,
    protected: false,
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: <FaUsers size={20} />,
    protected: true,
  },
  {
    label: 'Contracts',
    path: '/contracts',
    icon: <FaFileContract size={20} />,
    protected: true,
  },
  {
    label: 'Terms & Conditions',
    path: '/terms-and-conditions',
    icon: <FaFileAlt size={20} />,
    protected: false,
  },
];

const authItems: MenuItem[] = [
  {
    label: 'Login',
    path: '/login',
    icon: <FaSignInAlt size={20} />,
    protected: false,
  },
  {
    label: 'Register',
    path: '/register',
    icon: <FaUserPlus size={20} />,
    protected: false,
  },
];

interface MenuItemLinkProps {
  to: string;
  onClick: () => void;
  icon?: JSX.Element;
  children: React.ReactNode;
}

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
    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
  >
    {icon}
    <span>{children}</span>
  </MenuItem>
);

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    [],
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [navigate]);

  const renderMenuItems = (items: MenuItem[]) =>
    items.map(({ label, path, icon, protected: isProtected }) =>
      !isProtected || isLoggedIn() ? (
        <Button
          key={path}
          color="inherit"
          component={Link}
          to={path}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {icon}
          {label}
        </Button>
      ) : null,
    );

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {renderMenuItems(menuItems)}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {isLoggedIn() && (
            <Button
              color="inherit"
              component={Link}
              to="/profile"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FaUser size={20} />
              Profile
            </Button>
          )}
          {isLoggedIn() ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FaSignOutAlt size={20} />
              Logout
            </Button>
          ) : (
            renderMenuItems(authItems)
          )}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {menuItems.map(({ label, path, icon, protected: isProtected }) =>
              !isProtected || isLoggedIn() ? (
                <MenuItemLink
                  key={path}
                  to={path}
                  onClick={handleMenuClose}
                  icon={icon}
                >
                  {label}
                </MenuItemLink>
              ) : null,
            )}
            {isLoggedIn() && (
              <MenuItemLink
                to="/profile"
                onClick={handleMenuClose}
                icon={<FaUser size={20} />}
              >
                Profile
              </MenuItemLink>
            )}
            {isLoggedIn() ? (
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }}
              >
                <FaSignOutAlt size={20} />
                Logout
              </MenuItem>
            ) : (
              authItems.map(({ label, path, icon }) => (
                <MenuItemLink
                  key={path}
                  to={path}
                  onClick={handleMenuClose}
                  icon={icon}
                >
                  {label}
                </MenuItemLink>
              ))
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Navbar);
