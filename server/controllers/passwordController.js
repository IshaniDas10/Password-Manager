const prisma = require("../config/prisma");

const { encrypt, decrypt } = require("../utils/encryption");



exports.addPassword = async (req, res) => {
  try {
    const { website, username, password } = req.body;

    // Validate input
    if (!website || !username || !password) {
      return res.status(400).json({
        message: "Website, username and password are required",
      });
    }

    // Save password
   const savedPassword = await prisma.password.create({
  data: {
    website,
    username,
    password: encrypt(password),
    userId: req.user.id,
  },
});

    res.status(201).json({
      message: "Password saved successfully",
      data: savedPassword,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// Get all passwords for logged-in user
exports.getAllPasswords = async (req, res) => {
  try {
    const passwords = await prisma.password.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: passwords.length,
      data: passwords,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// Update a password
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { website, username, password } = req.body;

    // Check if password belongs to logged-in user
    const existingPassword = await prisma.password.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!existingPassword) {
      return res.status(404).json({
        message: "Password not found",
      });
    }

    const updatedPassword = await prisma.password.update({
      where: {
        id: Number(id),
      },
      data: {
        website,
        username,
        password,
      },
    });

    res.status(200).json({
      message: "Password updated successfully",
      data: updatedPassword,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// Delete a password
exports.deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if password belongs to logged-in user
    const existingPassword = await prisma.password.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!existingPassword) {
      return res.status(404).json({
        message: "Password not found",
      });
    }

    await prisma.password.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Password deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};