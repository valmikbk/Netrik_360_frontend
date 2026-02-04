import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
} from 'recharts';
import {
  Assessment,
  MonetizationOn,
  Payments,
  AccountBalance,
  LocalDrink,
  Engineering,
  AccountBalanceWallet,
  AttachMoney,
  Download,
  PictureAsPdf,
} from '@mui/icons-material';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function SalesDetails() {
  const reports = [
    { id: 1, date: '2025-10-10', totalSale: 900000, totalPurchase: 500000, electricityBill: 20000, waterBill: 5000, employeeSalary: 120000, miscExpenses: 15000 },
    { id: 2, date: '2025-10-05', totalSale: 850000, totalPurchase: 480000, electricityBill: 22000, waterBill: 6000, employeeSalary: 115000, miscExpenses: 10000 },
    { id: 3, date: '2025-09-15', totalSale: 950000, totalPurchase: 520000, electricityBill: 18000, waterBill: 4000, employeeSalary: 125000, miscExpenses: 20000 },
    { id: 4, date: '2025-01-20', totalSale: 400000, totalPurchase: 250000, electricityBill: 15000, waterBill: 3000, employeeSalary: 90000, miscExpenses: 5000 },
  ];

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [filter, setFilter] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState('pie');

  const getWeekRange = (offsetWeeks = 0) => {
    const now = new Date();
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1 - offsetWeeks * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return [monday, sunday];
  };

  const filteredReports = useMemo(() => {
    const now = new Date();
    let start, end;
    switch (filter) {
      case 'thisWeek': [start, end] = getWeekRange(0); break;
      case 'lastWeek': [start, end] = getWeekRange(1); break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'currentYear':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'custom':
        start = startDate ? new Date(startDate) : new Date('2000-01-01');
        end = endDate ? new Date(endDate + 'T23:59:59') : new Date();
        break;
      default:
        start = new Date('2000-01-01'); end = new Date();
    }
    return reports.filter(r => {
      const reportDate = new Date(r.date);
      return reportDate >= start && reportDate <= end;
    });
  }, [filter, startDate, endDate, reports]);

  const summary = filteredReports.reduce((acc, r) => {
    const totalExpenses = r.totalPurchase + r.electricityBill + r.waterBill + r.employeeSalary + r.miscExpenses;
    const profit = r.totalSale - totalExpenses;
    acc.totalSale += r.totalSale;
    acc.totalPurchase += r.totalPurchase;
    acc.electricityBill += r.electricityBill;
    acc.waterBill += r.waterBill;
    acc.employeeSalary += r.employeeSalary;
    acc.miscExpenses += r.miscExpenses;
    acc.totalTurnover += totalExpenses;
    acc.profit += profit;
    return acc;
  }, { totalSale: 0, totalPurchase: 0, electricityBill: 0, waterBill: 0, employeeSalary: 0, miscExpenses: 0, totalTurnover: 0, profit: 0 });

  const summaryChartData = [
    { name: 'Total Sale', value: summary.totalSale },
    { name: 'Total Purchase', value: summary.totalPurchase },
    { name: 'Electricity Bill', value: summary.electricityBill },
    { name: 'Water Bill', value: summary.waterBill },
    { name: 'Employee Salary', value: summary.employeeSalary },
    { name: 'Miscellaneous', value: summary.miscExpenses },
    { name: 'Profit', value: summary.profit },
  ];

  const COLORS = ['#00bcd4', '#82ca9d', '#ffc658', '#ff7f50', '#a569bd', '#8bc34a', '#8884d8'];

  const kpiCards = [
    { title: 'Total Sale', value: `₹${summary.totalSale.toLocaleString('en-IN')}`, icon: <MonetizationOn />, color: '#fef6e4' },
    { title: 'Total Purchase', value: `₹${summary.totalPurchase.toLocaleString('en-IN')}`, icon: <Payments />, color: '#e9edc9' },
    { title: 'Electricity Bill', value: `₹${summary.electricityBill.toLocaleString('en-IN')}`, icon: <AccountBalance />, color: '#dbe7e4' },
    { title: 'Water Bill', value: `₹${summary.waterBill.toLocaleString('en-IN')}`, icon: <LocalDrink />, color: '#f0efeb' },
    { title: 'Employee Salary', value: `₹${summary.employeeSalary.toLocaleString('en-IN')}`, icon: <Engineering />, color: '#fefae0' },
    { title: 'Miscellaneous', value: `₹${summary.miscExpenses.toLocaleString('en-IN')}`, icon: <AccountBalanceWallet />, color: '#faedcd' },
    { title: 'Total Turnover', value: `₹${summary.totalTurnover.toLocaleString('en-IN')}`, icon: <AttachMoney />, color: '#e9edc9' },
    { title: 'Profit', value: `₹${summary.profit.toLocaleString('en-IN')}`, icon: <Assessment />, color: '#ccd5ae' },
  ];

  // CSV Download
  const handleDownloadCSV = () => {
    if (filteredReports.length === 0) { alert('No data available to download.'); return }
    const headers = ['Date','Total Sale (₹)','Total Purchase (₹)','Electricity Bill (₹)','Water Bill (₹)','Employee Salary (₹)','Miscellaneous (₹)','Total Turnover (₹)','Profit (₹)'];
    const rows = filteredReports.map(r => {
      const totalExpenses = r.totalPurchase + r.electricityBill + r.waterBill + r.employeeSalary + r.miscExpenses;
      const profit = r.totalSale - totalExpenses;
      return [r.date, r.totalSale, r.totalPurchase, r.electricityBill, r.waterBill, r.employeeSalary, r.miscExpenses, totalExpenses, profit];
    });
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Sales_Report.csv';
    link.click();
  };

  // PDF Download
  const handleDownloadPDF = () => {
    if (filteredReports.length === 0) { alert('No data available to download.'); return }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 22);

    const headers = [['Date','Total Sale (₹)','Total Purchase (₹)','Electricity Bill (₹)','Water Bill (₹)','Employee Salary (₹)','Miscellaneous (₹)','Total Turnover (₹)','Profit (₹)']];
    const rows = filteredReports.map(r => {
      const totalExpenses = r.totalPurchase + r.electricityBill + r.waterBill + r.employeeSalary + r.miscExpenses;
      const profit = r.totalSale - totalExpenses;
      return [r.date, r.totalSale, r.totalPurchase, r.electricityBill, r.waterBill, r.employeeSalary, r.miscExpenses, totalExpenses, profit];
    });

    autoTable(doc, { head: headers, body: rows, startY: 30, styles: { fontSize: 8 } });
    doc.save('Sales_Report.pdf');
  };

  return (
    <Box sx={{ minHeight: '100vh', p: isSmallScreen ? 2 : 4, background: 'linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)' }}>
      <Typography variant="h4" fontWeight={700} color="#1e293b" mb={4}>📊 Sales Dashboard</Typography>

      {/* === Filters + Summary Section === */}
      <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'white' }}>
        {/* Time Filter */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select value={filter} onChange={e => setFilter(e.target.value)} label="Time Range">
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="currentYear">Current Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {filter === 'custom' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={e => setStartDate(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={e => setEndDate(e.target.value)} />
              </Grid>
            </>
          )}
        </Grid>

        {/* KPI Cards */}
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {kpiCards.map((card, i) => {
            // const cardColors = ['#fef6e4','#e9edc9','#dbe7e4','#f0efeb','#fefae0','#faedcd','#e0f7fa','#f0d6ff'];
            const cardColors = [
  '#e0f7fa', // Light Cyan
  '#e8f5e9', // Light Green
  '#fff3e0', // Light Orange
  '#fce4ec', // Light Pink
  '#ede7f6', // Light Purple
  '#f3e5f5', // Soft Lavender
  '#f9fbe7', // Pale Lime
  '#e3f2fd', // Soft Blue
];

            return (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper
                  elevation={6}
                  sx={{
                    width: 220,
                    height: 220,
                    bgcolor: cardColors[i % cardColors.length],
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: 40, color: '#1e293b' }}>{card.icon}</Box>
                  <Typography fontWeight={600} fontSize="1rem" color="text.secondary">{card.title}</Typography>
                  <Typography fontWeight={700} fontSize="1.5rem" color="#1e293b">{card.value}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Chart Section */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, background: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>Sales Analysis Chart</Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select value={chartType} onChange={e => setChartType(e.target.value)} label="Chart Type">
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie data={summaryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {summaryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={summaryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Paper>

      {/* Download Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownloadCSV}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: 'linear-gradient(90deg, #4a90e2, #007bff)',
            '&:hover': { background: 'linear-gradient(90deg, #357ae8, #0056d2)' },
          }}
        >
          Download CSV
        </Button>
        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={handleDownloadPDF}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: 'linear-gradient(90deg, #e53935, #d32f2f)',
            '&:hover': { background: 'linear-gradient(90deg, #c62828, #b71c1c)' },
          }}
        >
          Download PDF
        </Button>
      </Box>
    </Box>
  );
}

export default SalesDetails;
