const express = require("express");
const router = express.Router();

const { generatePassword } = require("../controllers/generatorController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route
router.post("/", authMiddleware, generatePassword);

module.exports = router;