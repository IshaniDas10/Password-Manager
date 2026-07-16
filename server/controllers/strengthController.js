const zxcvbn = require("zxcvbn");

exports.checkStrength = (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const result = zxcvbn(password);

   const strengthLevels = [
  "Very Weak",
  "Weak",
  "Fair",
  "Strong",
  "Very Strong",
];

const colors = [
  "red",
  "orangered",
  "orange",
  "limegreen",
  "green",
];

res.status(200).json({
  passwordLength: password.length,
  score: result.score,
  strength: strengthLevels[result.score],
  color: colors[result.score],
  crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
  warning: result.feedback.warning,
  suggestions: result.feedback.suggestions,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};