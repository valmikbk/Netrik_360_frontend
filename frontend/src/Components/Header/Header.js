import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import MeghanaLogo from "../Logo/Meghana_stone_logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ------------------ GET USER ROLE ------------------ */
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // "admin" | "user"

  /* ------------------ PROFILE MENU STATE ------------------ */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getLinkStyle = (path) => ({
    textDecoration: location.pathname.includes(path) ? "underline" : "none",
    color: "black",
    fontWeight: "bold",
    marginLeft: "20px",
    marginRight: "20px",
    fontSize: "1rem",
    transition: "0.2s",
  });

  /* ------------------ PROFILE MENU HANDLERS ------------------ */
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile"); // create later
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "#edeff0ff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* LEFT LOGO */}
          <Box
            component="img"
            src={MeghanaLogo}
            alt="Logo"
            sx={{
              height: { xs: 32, sm: 40, md: 48 },
              width: "auto",
              objectFit: "contain",
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          />

          {/* CENTER NAV (ROLE BASED) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* HOME — visible to ALL */}
            <Link to="/home" style={getLinkStyle("/home")}>
              HOME
            </Link>

            {/* ADMIN ONLY OPTIONS */}
            {role === "admin" && (
              <>
                <Link to="/master" style={getLinkStyle("/master")}>MASTER</Link>
                <Link to="/blasting" style={getLinkStyle("/blasting")}>BLASTING</Link>
                <Link to="/payments" style={getLinkStyle("/payments")}>PAYMENTS</Link>
                <Link to="/fuel-in-out" style={getLinkStyle("/fuel-in-out")}>FUEL IN/OUT</Link>
                <Link to="/daily-purchase" style={getLinkStyle("/daily-purchase")}>DAILY PURCHASE</Link>
                <Link to="/salary" style={getLinkStyle("/salary")}>SALARY</Link>
                <Link to="/electricity-bill" style={getLinkStyle("/electricity-bill")}>
                  ELECTRICITY BILL
                </Link>
                <Link to="/reports" style={getLinkStyle("/reports")}>REPORTS</Link>
              </>
            )}
          </Box>

          {/* RIGHT PROFILE ICON */}
          <Avatar
            onClick={handleProfileClick}
            sx={{
              height: { xs: 32, sm: 40, md: 48 },
              width: { xs: 32, sm: 40, md: 48 },
              cursor: "pointer",
              bgcolor: "transparent",
            }}
          >
            <AccountCircleIcon
              sx={{
                fontSize: { xs: 32, sm: 40, md: 48 },
                color: "text.primary",
              }}
            />
          </Avatar>

          {/* PROFILE MENU */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {/* <MenuItem onClick={handleProfile}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem> */}

            <Divider />

            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </>
  );
}

export default Header;
