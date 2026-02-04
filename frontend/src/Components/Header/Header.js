import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import netrikLogo from "../Logo/netrik_logo.png";
import MeghanaLogo from "../Logo/Meghana_stone_logo.png";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Header() {
  const location = useLocation();

  const getLinkStyle = (path) => ({
    textDecoration: location.pathname.includes(path) ? "underline" : "none",
    // color: "#fff",
    color:"black",
    fontWeight: "bold",
    marginLeft: "20px",
    marginRight: "20px",
    fontSize: "1rem",
    transition: "0.2s",
  });

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          // background: "linear-gradient(90deg, #1e293b 0%, #334155 50%, #475569 100%)",
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
          {/* Left Logo */}
          <Box
            component="img"
            src={MeghanaLogo}
            alt="Left Logo"
            sx={{
              height: { xs: 32, sm: 40, md: 48 },
              width: "auto",
              objectFit: "contain",
            }}
          />

          {/* Center Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Link to="/home" style={getLinkStyle("/home")}>
              Home
            </Link>
            <Link to="/master" style={getLinkStyle("/master")}>
              Master
            </Link>
            <Link to="/blasting" style={getLinkStyle("/blasting")}>
              Blasting
            </Link>
            <Link to="/payments" style={getLinkStyle("/payments")}>
              Payments
            </Link>
            <Link to="/fuel-in-out" style={getLinkStyle("/fuel-in-out")}>
              Fuel IN/OUT
            </Link>
            <Link to="/daily-purchase" style={getLinkStyle("/daily-purchase")}>
              Daily Purchase
            </Link>
            <Link to="/salary" style={getLinkStyle("/salary")}>
              Salary
            </Link>
            <Link to="/electricity-bill" style={getLinkStyle("/electricity-bill")}>
              Electricity Bill
            </Link>
            <Link to="/reports" style={getLinkStyle("/reports")}>
              Reports
            </Link>
            {/* <Link to="/dashboard" style={getLinkStyle("/dashboard")}>
              Dashboard
            </Link> */}
          </Box>

          {/* Right Logo */}
          <Avatar
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
        </Toolbar>
      </AppBar>

      {/* Spacer to prevent content being hidden under fixed AppBar */}
      <Toolbar />
    </>
  );
}

export default Header;
