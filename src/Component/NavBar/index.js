import {
  AccountCircle,
  Dashboard,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openCart } from "../../Redux/cart";
import logout from "../Auth/logout";

export default function NavigationBar() {
  const { singedIn, email, role } = useSelector((state) => state.user);
  const { count } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FFFFFF8D",
        boxShadow: "0 2px 6px 0 rgb(0 0 0 / 12%)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              color: "black",
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: "0.1rem",
              textDecoration: "none",
            }}
          >
            ATN toys
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          {singedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={() => {
                  dispatch(openCart());
                }}
              >
                <Badge badgeContent={count} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
            </Box>
          ) : (
            ""
          )}

          {!role.includes("staff") && !role.includes("admin") ? (
            ""
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                <Dashboard />
              </IconButton>
            </Box>
          )}

          {singedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Click to open menu">
                <IconButton onClick={handleOpenUserMenu}>
                  <AccountCircle htmlColor="#646766" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disableTouchRipple>
                  <Typography textAlign="center">{email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate("/orders");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Orders</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Button variant="outlined" onClick={logout} fullWidth>
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            ""
          )}

          {singedIn ? (
            ""
          ) : (
            <Box display="flex" flexGrow="0">
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Box width="10px" />
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Create an account
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
