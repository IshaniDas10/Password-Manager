const generator = require("generate-password");

exports.generatePassword = (req, res) => {
  try {
    const {
      length = 16,
      numbers = true,
      symbols = true,
      uppercase = true,
      lowercase = true,
    } = req.body;

    const password = generator.generate({
      length: Number(length),
      numbers,
      symbols,
      uppercase,
      lowercase,
      strict: true,
    });

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