import React, { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import {
  LocalShipping,
  Speed,
  EvStation,
  MonetizationOn,
  AttachMoney,
  Assessment,
  Download,
} from '@mui/icons-material'

function TruckDetails() {
  const trucks = [
    { serial: 1, truckNumber: 'MH12AB1234', materialType: 'Cement', quantity: 20, distanceCovered: 150, dieselConsumed: 50, price: 5000, dateTime: '2025-10-02 09:30 AM' },
    { serial: 2, truckNumber: 'MH14CD5678', materialType: 'Steel', quantity: 10, distanceCovered: 200, dieselConsumed: 70, price: 7000, dateTime: '2025-10-09 10:15 AM' },
    { serial: 3, truckNumber: 'MH20EF9012', materialType: 'Sand', quantity: 15, distanceCovered: 120, dieselConsumed: 40, price: 4500, dateTime: '2025-10-08 11:00 AM' },
    { serial: 4, truckNumber: 'MH22GH3456', materialType: 'Gravel', quantity: 18, distanceCovered: 180, dieselConsumed: 60, price: 6000, dateTime: '2025-10-12 11:45 AM' },
    { serial: 5, truckNumber: 'MH25IJ7890', materialType: 'Bricks', quantity: 25, distanceCovered: 220, dieselConsumed: 80, price: 8000, dateTime: '2025-09-25 12:30 PM' },
    { serial: 6, truckNumber: 'MH28KL1234', materialType: 'Cement', quantity: 22, distanceCovered: 160, dieselConsumed: 55, price: 5500, dateTime: '2025-10-10 01:15 PM' },
    { serial: 7, truckNumber: 'MH30MN5678', materialType: 'Steel', quantity: 12, distanceCovered: 190, dieselConsumed: 65, price: 7500, dateTime: '2025-10-01 02:00 PM' },
  ]

  const dieselRate = 100

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const [selectedTruck, setSelectedTruck] = useState('all')
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0])
  const [chartType, setChartType] = useState('pie')

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const filteredTrucks = useMemo(() => {
    return trucks.filter((t) => {
      const matchesTruck = selectedTruck === 'all' || t.truckNumber === selectedTruck
      const truckDate = new Date(t.dateTime)
      const matchesDate =
        truckDate >= new Date(startDate) && truckDate <= new Date(endDate + 'T23:59:59')
      return matchesTruck && matchesDate
    })
  }, [trucks, selectedTruck, startDate, endDate])

  const summary = filteredTrucks.reduce(
    (acc, t) => {
      acc.quantity += t.quantity
      acc.distance += t.distanceCovered
      acc.diesel += t.dieselConsumed
      acc.materialCost += t.price
      acc.dieselCost += t.dieselConsumed * dieselRate
      return acc
    },
    { quantity: 0, distance: 0, diesel: 0, materialCost: 0, dieselCost: 0 }
  )
  summary.totalCost = summary.materialCost + summary.dieselCost

  const pieData = [
    { name: 'Quantity (tons)', value: summary.quantity },
    { name: 'Material Cost (₹)', value: summary.materialCost },
    { name: 'Distance Covered (km)', value: summary.distance },
    { name: 'Diesel Consumed (L)', value: summary.diesel },
    { name: 'Diesel Cost (₹)', value: summary.dieselCost },
  ]
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4']

  const kpiCards = [
    { title: 'Total Quantity', value: `${summary.quantity} tons`, icon: <LocalShipping />, color: '#e0f7fa' },
    { title: 'Total Distance', value: `${summary.distance} km`, icon: <Speed />, color: '#e8f5e9' },
    { title: 'Total Diesel', value: `${summary.diesel} L`, icon: <EvStation />, color: '#fff3e0' },
    { title: 'Material Cost', value: `₹${summary.materialCost.toLocaleString('en-IN')}`, icon: <MonetizationOn />, color: '#fce4ec' },
    { title: 'Diesel Cost', value: `₹${summary.dieselCost.toLocaleString('en-IN')}`, icon: <AttachMoney />, color: '#ede7f6' },
    { title: 'Profit', value: `₹${summary.totalCost.toLocaleString('en-IN')}`, icon: <Assessment />, color: '#f3e5f5' },
  ]

  // === Download CSV function ===
  const handleDownloadCSV = () => {
    if (filteredTrucks.length === 0) {
      alert('No data available to download.')
      return
    }

    const headers = [
      'Serial',
      'Truck Number',
      'Material Type',
      'Quantity (tons)',
      'Distance Covered (km)',
      'Diesel Consumed (L)',
      'Material Cost (₹)',
      'Diesel Cost (₹)',
      'Total Cost (₹)',
      'Date & Time',
    ]

    const rows = filteredTrucks.map((t) => {
      const dieselCost = t.dieselConsumed * dieselRate
      const totalCost = t.price + dieselCost
      return [
        t.serial,
        t.truckNumber,
        t.materialType,
        t.quantity,
        t.distanceCovered,
        t.dieselConsumed,
        t.price,
        dieselCost,
        totalCost,
        t.dateTime,
      ]
    })

    const csvContent =
      [headers, ...rows].map((row) => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Truck_Details.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Truck Details Dashboard
      </Typography>

      {/* === Filters === */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Select Truck</InputLabel>
          <Select value={selectedTruck} label="Select Truck" onChange={(e) => setSelectedTruck(e.target.value)}>
            <MenuItem value="all">All Trucks</MenuItem>
            {trucks.map((truck) => (
              <MenuItem key={truck.serial} value={truck.truckNumber}>
                {truck.truckNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Download Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleDownloadCSV}
          sx={{ ml: 'auto', height: 56 }}
        >
          Download
        </Button>
      </Box>

      {/* === Summary Section === */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
        Summary Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {kpiCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${card.color} 0%, #ffffff 100%)`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  mr: 3,
                  fontSize: 30,
                  color: '#333',
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#555' }}>
                  {card.title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem', mt: 0.5 }}>
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* === Table Section === */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
        Truck Details Table
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 5, borderRadius: 2 }}>
        <Table size={isSmallScreen ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Serial</TableCell>
              <TableCell>Truck</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Qty (tons)</TableCell>
              <TableCell>Distance (km)</TableCell>
              <TableCell>Diesel (L)</TableCell>
              <TableCell>Material ₹</TableCell>
              <TableCell>Diesel ₹</TableCell>
              <TableCell>Total ₹</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrucks.map((t) => {
              const dieselCost = t.dieselConsumed * dieselRate
              const totalCost = t.price + dieselCost
              return (
                <TableRow key={t.serial}>
                  <TableCell>{t.serial}</TableCell>
                  <TableCell>{t.truckNumber}</TableCell>
                  <TableCell>{t.materialType}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell>{t.distanceCovered}</TableCell>
                  <TableCell>{t.dieselConsumed}</TableCell>
                  <TableCell>₹{t.price.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{dieselCost.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{totalCost.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{t.dateTime}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* === Chart Section === */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
        Analytics & Visualization
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#f9fafb' }}>
        <FormControl sx={{ minWidth: 180, mb: 3 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select value={chartType} label="Chart Type" onChange={(e) => setChartType(e.target.value)}>
            <MenuItem value="pie">Pie Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="area">Area Chart</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ width: '100%', height: { xs: 250, sm: 350, md: 400 } }}>
          <ResponsiveContainer>
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isSmallScreen ? 80 : 120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            ) : chartType === 'bar' ? (
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            ) : (
              <AreaChart data={pieData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}

export default TruckDetails
