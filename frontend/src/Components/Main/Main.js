import React from "react";
import { AppBar, Toolbar, Box, Button, Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom"; // Outlet for nested content
import Home from "../Home/Home";

function Main() {
  return (
    <>
      <Home />
    </>
  );
}

export default Main;
