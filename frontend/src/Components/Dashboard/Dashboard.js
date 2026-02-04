 import React from 'react'
import { Box } from '@mui/material'
import Header from '../Header/Header'
import DashboardNavBar from './DashboardNavBar'

function Dashboard({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box>
        {/* Header */}
        <Header />
      </Box>

      {/* Main area: Navbar + Page Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', zIndex:1000 }}>
        {/* Sidebar / Navbar starts right below Header */}
        <DashboardNavBar sx={{ flexShrink: 0 }} />

        {/* Page content */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
