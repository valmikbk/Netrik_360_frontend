import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("Inactive");
  const [plcStatus, setPlcStatus] = useState("Inactive");
  const [liveData, setLiveData] = useState({
    materialType: "20mm Aggregate",
    truckNumber: "KA 51 AB 4321",
    weight: "32 brass",
  });

  // Start webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraStatus("Active");
      } catch (err) {
        console.error(err);
        setCameraStatus("Inactive");
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulate PLC status
  useEffect(() => {
    const interval = setInterval(() => {
      setPlcStatus(Math.random() > 0.5 ? "Active" : "Inactive");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live data rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const dummyDataList = [
        { materialType: "10mm Aggregate", truckNumber: "KA 03 CB 1298", weight: "26 brass" },
        { materialType: "20mm Aggregate", truckNumber: "KA 11 B 7642", weight: "30 brass" },
        { materialType: "40mm Aggregate", truckNumber: "KA 25 AD 5531", weight: "34 brass" },
        { materialType: "Crusher Dust", truckNumber: "KA 41 CZ 8420", weight: "29 brass" },
        { materialType: "20mm Aggregate", truckNumber: "KA 51 AB 4321", weight: "32 brass" },
      ];
      setLiveData(dummyDataList[Math.floor(Math.random() * dummyDataList.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => (status === "Active" ? "#4CAF50" : "red");
  const isCameraActive = cameraStatus === "Active";
  const statusColor = isCameraActive ? "#4CAF50" : "red";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header />

      {/* Main content */}
      {/* <Box sx={{ display: "flex", gap: 3, p: 3, height: "650px" }}> */}
      <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },

    gap: { xs: 2, sm: 3, lg: 4 },

    p: { xs: 2, sm: 3, lg: 4 },

    height: { xs: "auto", md: "650px", xl: "75vh" },

    maxWidth: {
      xs: "100%",
      lg: "1400px",
      xl: "1800px",
    },

    width: "100%",
    mx: "auto", // center on large screens
  }}
>

        {/* Left: Camera */}
        <Paper
          elevation={4}
          sx={{
            flex: 2,
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
              transform: "none", // ensures no flip
            }}
          />

        </Paper>

        {/* Right: Live Data */}
        <Paper
          elevation={6}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(145deg, #f5f7fa 0%, #e4ebf0 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #1976d2, #2196f3)",
              borderRadius: 2,
              p: 1.5,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              📊 Live Data
            </Typography>
            <FiberManualRecordIcon
              sx={{
                color: statusColor,
                animation: isCameraActive ? "pulse 1.5s infinite ease-in-out" : "none",
              }}
            />
          </Box>

          {/* Data Fields */}
          <Box sx={{ flex: 1 }}>
            {[
              { label: "Material Type", value: liveData.materialType },
              { label: "Truck Number", value: liveData.truckNumber },
              { label: "Weight", value: liveData.weight },
              { label: "Timestamp", value: new Date().toLocaleTimeString() },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": { backgroundColor: "#f0f7ff" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FiberManualRecordIcon
                    sx={{ color: statusColor, mr: 1, fontSize: 14 }}
                  />
                  <Typography variant="body1" fontWeight={500}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: "#555", fontSize: "0.85rem", fontStyle: "italic" }}>
              ⏱️ Auto-refreshing live data
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <button
                onClick={() => navigate("/invoice-generation")}
                style={{
                  backgroundColor: "#16a34a", // green
                  color: "#fff",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                🧾 SALES BILL
              </button>

              <button
                onClick={() => navigate("/purchase-bill")}
                style={{
                  backgroundColor: "#dc2626", // red
                  color: "#fff",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                📦 RAW MATERIAL
              </button>
            </Box>

          </Box>


          <style>
            {`
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}
          </style>
        </Paper>
      </Box>

      {/* Bottom Strip */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          background: "linear-gradient(90deg, #1e293b 0%, #334155 50%, #475569 100%)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1200, // above all content
          boxShadow: "0 -2px 8px rgba(0,0,0,0.2)", // subtle shadow
        }}
      >
        <Typography variant="body1">
          🎥 Camera:{" "}
          <span style={{ color: getStatusColor(cameraStatus), fontWeight: "bold" }}>
            {cameraStatus}
          </span>
        </Typography>
        <Typography variant="body1">
          🔌 PLC:{" "}
          <span style={{ color: getStatusColor(plcStatus), fontWeight: "bold" }}>
            {plcStatus}
          </span>
        </Typography>
      </Box>



    </Box>
  );
}

export default Home;
