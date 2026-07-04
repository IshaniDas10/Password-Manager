const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const passwordController = require("../controllers/passwordController");

router.post("/", authMiddleware, passwordController.addPassword);

router.get("/", authMiddleware, passwordController.getAllPasswords);

router.put("/:id", authMiddleware, passwordController.updatePassword);

router.delete("/:id", authMiddleware, passwordController.deletePassword);

router.get("/:id/reveal", authMiddleware, passwordController.revealPassword);

module.exports = router;

