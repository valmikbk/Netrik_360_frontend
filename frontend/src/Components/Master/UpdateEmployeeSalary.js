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
    if (!form.employeeId || !form.salary) {
      alert("Please select employee and enter salary");
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
        alert(data.error || "Update failed");
        return;
      }

      alert(data.message);
      setForm({ employeeId: "", salary: "" });
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* DEACTIVATE EMPLOYEE */
  const handleDeactivate = async () => {
    if (!form.employeeId) {
      alert("Select employee first");
      return;
    }

    if (!window.confirm("Deactivate this employee?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/employees/${form.employeeId}/deactivate/`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Action failed");
        return;
      }

      alert(data.message);

      // remove from dropdown immediately
      setEmployees(employees.filter(e => e.id !== form.employeeId));
      setForm({ employeeId: "", salary: "" });
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2, background: "linear-gradient(90deg, #1a237e, #283593)", }}>
        <Typography variant="h6" color="#fff" fontWeight={600} textAlign="center">
          UPDATE EMPLOYEE
        </Typography>
      </Box>

      <Divider />

      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            select
            label="Employee Name *"
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

          <TextField
            label="Salary *"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button
            variant="contained"
            sx={{ px: 4, backgroundColor: "#2962ff" }}
            onClick={handleUpdate}
            disabled={loading}
          >
            UPDATE &gt;&gt;
          </Button>

          <Button
            variant="contained"
            sx={{ px: 4, backgroundColor: "#f57c00" }}
            onClick={handleDeactivate}
            disabled={loading}
          >
            DEACTIVATE
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UpdateEmployeeSalary;
