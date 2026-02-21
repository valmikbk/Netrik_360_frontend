import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";

function UpdateEmployeeSalary() {
  const [form, setForm] = useState({
    employeeId: "",
    salary: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* FETCH ACTIVE EMPLOYEES */
  useEffect(() => {
    fetch("http://localhost:8000/api/employees/")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => alert("Failed to load employees"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* UPDATE SALARY */
  const handleUpdate = async () => {
    setError("");

    if (!form.employeeId || !form.salary) {
      setError("Please select employee and enter salary");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/employees/${form.employeeId}/update-salary/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salary: form.salary }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      alert(data.message);
      setForm({ employeeId: "", salary: "" });
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* DEACTIVATE EMPLOYEE */
  const handleDeactivate = async () => {
    setError("");

    if (!form.employeeId) {
      setError("Select employee first");
      return;
    }

    if (!window.confirm("DELETE THIS EMPLOYEE?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/employees/${form.employeeId}/deactivate/`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
        return;
      }

      alert(data.message);

      setEmployees(
        employees.filter((e) => e.id !== form.employeeId)
      );
      setForm({ employeeId: "", salary: "" });
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 INDUSTRIAL FIXED LABEL STYLE */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    flex: "0 0 240px",
    height: 56,
    background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
    border: "1px solid #90caf9",
    borderRadius: 1,
    px: 2,
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
  };

  return (
    <Card
      sx={{
        width: "98%",
        mx: "auto",
        minHeight: "80vh",
        borderRadius: 3,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(90deg, #1a237e, #283593)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 600, textAlign: "center" }}
        >
          UPDATE/DELETE EMPLOYEE SALARY
        </Typography>
      </Box>

      <Divider />

      <CardContent
        sx={{
          px: 8,
          py: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" flexDirection="column" gap={4}>

          {/* EMPLOYEE NAME */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>EMPLOYEE NAME *</Box>
            <TextField
              select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">
                <em>Select Employee</em>
              </MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* SALARY */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>SALARY *</Box>
            <TextField
              name="salary"
              value={form.salary}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* ERROR */}
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}
        </Box>

        {/* PUSH BUTTONS DOWN */}
        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            sx={{
              px: 6,
              backgroundColor: "#2962ff",
              "&:hover": { backgroundColor: "#0039cb" },
            }}
            onClick={handleUpdate}
            disabled={loading}
          >
            UPDATE &gt;&gt;
          </Button>

          <Button
            variant="contained"
            sx={{
              px: 6,
              backgroundColor: "#ed3110",
              "&:hover": { backgroundColor: "#c62828" },
            }}
            onClick={handleDeactivate}
            disabled={loading}
          >
            DELETE
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UpdateEmployeeSalary;
