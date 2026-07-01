const express = require("express");
require("dotenv").config();

const app = express();

// Allow server to read JSON data
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Password Manager Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});