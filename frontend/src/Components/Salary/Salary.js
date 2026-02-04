import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
} from "@mui/material";
import Header from "../Header/Header";

const daysInMonth = (year, month) =>
  new Date(year, month, 0).getDate();

const monthList = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function SalaryAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);

  const totalDays = daysInMonth(year, month);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    fetch("http://localhost:8000/api/employees/salary-list/")
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  /* ================= FETCH ATTENDANCE ================= */
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/attendance/month/?month=${month}&year=${year}`
    )
      .then(res => res.json())
      .then(setAttendance);
  }, [month, year]);

  /* ================= TOGGLE PRESENT / ABSENT ================= */
  const toggleAttendance = (empId, date) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [date]: prev[empId]?.[date] === "P" ? "A" : "P",
      },
    }));
  };

  /* ================= CALCULATIONS ================= */
  const salaryRows = useMemo(() => {
    return employees.map(emp => {
      const empAttendance = attendance[emp.id] || {};
      const presentDays = Object.values(empAttendance).filter(v => v === "P").length;
      const perDay = emp.salary / totalDays;
      const amount = +(perDay * presentDays).toFixed(2);

      return {
        ...emp,
        presentDays,
        amount,
      };
    });
  }, [attendance, employees, totalDays]);

  const totalAmount = salaryRows.reduce((s, r) => s + r.amount, 0);

  /* ================= SAVE ATTENDANCE ================= */
  const saveAttendance = async () => {
    const records = [];

    Object.entries(attendance).forEach(([empId, dates]) => {
      Object.entries(dates).forEach(([date, att]) => {
        records.push({
          employee_id: empId,
          date,
          attendance: att,
        });
      });
    });

    await fetch("http://localhost:8000/api/attendance/save/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    });

    alert("Attendance saved successfully");
  };

  return (
    <Box p={3}>
        <Header />
      <Typography variant="h5" fontWeight={700} mb={2}>
        Salary & Attendance
      </Typography>

      {/* ================= FILTERS ================= */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthList.map((m, i) => (
              <MenuItem key={i} value={i + 1}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </Box>
      </Card>

      {/* ================= SUMMARY ================= */}
      {/* <Card sx={{ p: 2, mb: 2, maxWidth: 420 }}>
        <Typography>Total Salary Amount</Typography>
        <Typography variant="h5" fontWeight={700} color="success.main">
          ₹ {totalAmount.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          Employees: {employees.length}
        </Typography>
      </Card> */}

      {/* ================= ATTENDANCE TABLE ================= */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Attendance Calendar</Typography>
        <Divider sx={{ mb: 2 }} />

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Employee</b></TableCell>
              {[...Array(totalDays)].map((_, i) => (
                <TableCell key={i} align="center">
                  {i + 1}
                </TableCell>
              ))}
              <TableCell><b>Days</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {salaryRows.map(emp => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>

                {[...Array(totalDays)].map((_, i) => {
                  const date = `${year}-${String(month).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                  const status = attendance[emp.id]?.[date] || "A";

                  return (
                    <TableCell
                      key={i}
                      align="center"
                      onClick={() => toggleAttendance(emp.id, date)}
                      sx={{
                        cursor: "pointer",
                        bgcolor: status === "P" ? "#c8e6c9" : "#ffcdd2",
                        fontWeight: 600,
                      }}
                    >
                      {status}
                    </TableCell>
                  );
                })}

                <TableCell>{emp.presentDays}</TableCell>
                <TableCell>₹ {emp.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box textAlign="right" mt={2}>
          <Button variant="contained" onClick={saveAttendance}>
            SAVE ATTENDANCE
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default SalaryAttendance;
