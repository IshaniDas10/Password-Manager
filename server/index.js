const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Allow requests from the frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Allow server to read JSON data
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Password Manager Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//registering route
const passwordRoutes = require("./routes/passwordRoutes");
app.use("/api/passwords", passwordRoutes);

const generatorRoutes = require("./routes/generatorRoutes");
app.use("/api/generator", generatorRoutes);

const strengthRoutes = require("./routes/strengthRoutes");
app.use("/api/strength", strengthRoutes);

