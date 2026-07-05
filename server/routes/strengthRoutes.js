const express = require("express");
const router = express.Router();

const { checkStrength } = require("../controllers/strengthController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, checkStrength);

module.exports = router;