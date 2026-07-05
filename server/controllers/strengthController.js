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

    res.status(200).json({
      score: result.score,
      strength:
        result.score === 0
          ? "Very Weak"
          : result.score === 1
          ? "Weak"
          : result.score === 2
          ? "Fair"
          : result.score === 3
          ? "Strong"
          : "Very Strong",
      feedback: result.feedback,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};