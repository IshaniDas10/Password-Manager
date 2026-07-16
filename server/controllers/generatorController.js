const crypto = require("crypto");

exports.generatePassword = (req, res) => {
  try {
    const {
      length = 16,
      numbers = true,
      symbols = true,
      uppercase = true,
      lowercase = true,
    } = req.body || {};

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (lowercase) charset += lower;
    if (uppercase) charset += upper;
    if (numbers) charset += nums;
    if (symbols) charset += syms;

    if (!charset) {
      return res.status(400).json({
        message: "At least one character type must be enabled",
      });
    }

    const len = Number(length);
    let password = "";

    for (let i = 0; i < len; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    res.status(200).json({
      generatedPassword: password,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};