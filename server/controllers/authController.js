const prisma = require("../config/prisma");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  res.json({
    message: "Data received successfully",
    email,
    password,
  });
};