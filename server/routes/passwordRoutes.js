const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const passwordController = require("../controllers/passwordController");

router.post("/", authMiddleware, passwordController.addPassword);

router.get("/", authMiddleware, passwordController.getAllPasswords);

router.get("/search", authMiddleware, passwordController.searchPasswords);

router.get("/dashboard", authMiddleware, passwordController.getDashboardStats);

router.post("/:id/request-reveal-otp", authMiddleware, passwordController.requestRevealOTP);
router.post("/:id/verify-reveal-otp", authMiddleware, passwordController.verifyRevealOTP);

router.put("/:id", authMiddleware, passwordController.updatePassword);

router.delete("/:id", authMiddleware, passwordController.deletePassword);


module.exports = router;

