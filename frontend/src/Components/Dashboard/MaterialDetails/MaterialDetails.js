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
  ProductionQuantityLimits,
  MonetizationOn,
  Assessment,
  Download,
} from '@mui/icons-material'

function MaterialDetails() {
  // === Sample Material Data with Date & Time ===
  const materials = [
    { id: 1, name: '20mm Aggregate', quantity: 400, unitCost: 700, salePrice: 900, dateTime: '2025-10-10 09:30 AM' },
    { id: 2, name: '10mm Aggregate', quantity: 350, unitCost: 650, salePrice: 850, dateTime: '2025-10-10 10:15 AM' },
    { id: 3, name: 'M-Sand', quantity: 300, unitCost: 600, salePrice: 850, dateTime: '2025-10-11 11:00 AM' },
    { id: 4, name: 'Stone Dust', quantity: 200, unitCost: 500, salePrice: 700, dateTime: '2025-10-11 12:45 PM' },
    { id: 5, name: '40mm Aggregate', quantity: 150, unitCost: 750, salePrice: 1000, dateTime: '2025-10-12 01:30 PM' },
  ]

  // === Default date range ===
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [selectedMaterial, setSelectedMaterial] = useState('all')
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0])
  const [chartType, setChartType] = useState('pie')

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // === Filtered Data ===
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesMaterial = selectedMaterial === 'all' || m.name === selectedMaterial
      const matDate = new Date(m.dateTime)
      const matchesDate =
        matDate >= new Date(startDate) && matDate <= new Date(endDate + 'T23:59:59')
      return matchesMaterial && matchesDate
    })
  }, [materials, selectedMaterial, startDate, endDate])

  // === Summary Calculation ===
  const summary = filteredMaterials.reduce(
    (acc, m) => {
      const totalMaterialCost = m.quantity * m.unitCost
      const totalSale = m.quantity * m.salePrice
      acc.quantity += m.quantity
      acc.totalMaterialCost += totalMaterialCost
      acc.totalSale += totalSale
      acc.profit += totalSale - totalMaterialCost
      return acc
    },
    { quantity: 0, totalMaterialCost: 0, totalSale: 0, profit: 0 }
  )

  // === Chart Data for Summary KPIs ===
  const summaryChartData = [
    { name: 'Quantity (tons)', value: summary.quantity },
    { name: 'Material Cost (₹)', value: summary.totalMaterialCost },
    { name: 'Total Sale (₹)', value: summary.totalSale },
    { name: 'Profit (₹)', value: summary.profit },
  ]
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50']

  // === KPI Cards ===
  const kpiCards = [
    { title: 'Total Quantity', value: `${summary.quantity} tons`, icon: <ProductionQuantityLimits />, color: '#e0f7fa' },
    { title: 'Total Purchase Cost', value: `₹${summary.totalMaterialCost.toLocaleString('en-IN')}`, icon: <Assessment />, color: '#ede7f6' },
    { title: 'Total Sale Amount', value: `₹${summary.totalSale.toLocaleString('en-IN')}`, icon: <MonetizationOn />, color: '#f3e5f5' },
    { title: 'Total Profit', value: `₹${summary.profit.toLocaleString('en-IN')}`, icon: <Assessment />, color: '#f3e5f5' },
  ]

  // === CSV Download ===
  const handleDownloadCSV = () => {
    if (filteredMaterials.length === 0) {
      alert('No data available to download.')
      return
    }

    const headers = ['Serial', 'Material', 'Quantity (tons)', 'Unit Cost (₹)', 'Sale Price (₹)', 'Total Material Cost (₹)', 'Total Sale (₹)', 'Profit (₹)', 'Date & Time']
    const rows = filteredMaterials.map((m, index) => {
      const totalMaterialCost = m.quantity * m.unitCost
      const totalSale = m.quantity * m.salePrice
      const profit = totalSale - totalMaterialCost
      return [index + 1, m.name, m.quantity, m.unitCost, m.salePrice, totalMaterialCost, totalSale, profit, m.dateTime]
    })
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Material_Dashboard.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Material Dashboard</Typography>

      {/* === Filters === */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Select Material</InputLabel>
          <Select value={selectedMaterial} label="Select Material" onChange={(e) => setSelectedMaterial(e.target.value)}>
            <MenuItem value="all">All Materials</MenuItem>
            {materials.map((m) => (
              <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="From Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <TextField label="To Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <Button variant="contained" color="primary" startIcon={<Download />} onClick={handleDownloadCSV} sx={{ ml: 'auto', height: 56 }}>
          Download
        </Button>
      </Box>

      {/* === KPI Cards === */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {kpiCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, background: `linear-gradient(135deg, ${card.color} 0%, #ffffff 100%)` }}>
              <Box sx={{ mr: 2, fontSize: 30 }}>{card.icon}</Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#555' }}>{card.title}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* === Material Table === */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Material Details Table</Typography>
      <TableContainer component={Paper} sx={{ mb: 5, borderRadius: 2 }}>
        <Table size={isSmallScreen ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Serial</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Quantity (tons)</TableCell>
              <TableCell>Unit Cost (₹)</TableCell>
              <TableCell>Sale Price (₹)</TableCell>
              <TableCell>Total Material Cost (₹)</TableCell>
              <TableCell>Total Sale (₹)</TableCell>
              <TableCell>Profit (₹)</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterials.map((m, index) => {
              const totalMaterialCost = m.quantity * m.unitCost
              const totalSale = m.quantity * m.salePrice
              const profit = totalSale - totalMaterialCost
              return (
                <TableRow key={m.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.quantity}</TableCell>
                  <TableCell>₹{m.unitCost.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{m.salePrice.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{totalMaterialCost.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{totalSale.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{profit.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{m.dateTime}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* === Summary Charts === */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Analytics & Visualization</Typography>
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
                <Pie data={summaryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={isSmallScreen ? 80 : 120} label>
                  {summaryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            ) : chartType === 'bar' ? (
              <BarChart data={summaryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            ) : (
              <AreaChart data={summaryChartData}>
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

export default MaterialDetails
