const prisma = require("../config/prisma");

const { encrypt, decrypt } = require("../utils/encryption");

const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/emailService");

exports.addPassword = async (req, res) => {
  try {
   const {
  website,
  username,
  password,
  notes,
  category,
} = req.body;

const faviconUrl = `https://www.google.com/s2/favicons?domain=${website}&sz=128`;

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
  notes,
  category,
  faviconUrl,
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
    const { website, username, password, notes, category } = req.body;
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

    // Generate new favicon if website changes
    const faviconUrl = website
      ? `https://www.google.com/s2/favicons?domain=${website}&sz=128`
      : existingPassword.faviconUrl;

    const updatedPassword = await prisma.password.update({
      where: {
        id: Number(id),
      },
      data: {
        website,
        username,
        password: password ? encrypt(password) : existingPassword.password,
        notes,
        category,
        faviconUrl,
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






// Search Passwords
exports.searchPasswords = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const passwords = await prisma.password.findMany({
      where: {
        userId: req.user.id,
        OR: [
          {
            website: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        website: "asc",
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



// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {

    const totalPasswords = await prisma.password.count({
      where: {
        userId: req.user.id,
      },
    });

    

    const categoryStats = await prisma.password.groupBy({
  by: ["category"],
  where: {
    userId: req.user.id,
  },
  _count: {
    category: true,
  },
});




const categories = {};

categoryStats.forEach((item) => {
  if (item.category) {
    categories[item.category] = item._count.category;
  } else {
    categories["uncategorized"] = totalPasswords -
      categoryStats.reduce(
        (sum, c) => sum + c._count.category,
        0
      );
  }
});


const recentPasswords = await prisma.password.findMany({
  where: {
    userId: req.user.id,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 5,
  select: {
    id: true,
    website: true,
    username: true,
    category: true,
    faviconUrl: true,
    createdAt: true,
  },
});


let mostUsedCategory = null;
let maxCount = 0;

for (const [category, count] of Object.entries(categories)) {
  if (count > maxCount) {
    maxCount = count;
    mostUsedCategory = {
      category,
      count,
    };
  }
}


res.status(200).json({
  totalPasswords,
  categories,
  recentPasswords,
  mostUsedCategory,
});



  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};




// Request OTP before revealing a password
exports.requestRevealOTP = async (req, res) => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        revealOTP: otp,
        revealOTPExpiresAt: expiresAt,
      },
    });

    await sendOTPEmail(req.user.email, otp);

    res.status(200).json({
      message: "OTP sent to your email. It expires in 5 minutes.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// Verify OTP and reveal the decrypted password
exports.verifyRevealOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user.revealOTP || user.revealOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (!user.revealOTPExpiresAt || new Date() > user.revealOTPExpiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const savedPassword = await prisma.password.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!savedPassword) {
      return res.status(404).json({
        message: "Password not found",
      });
    }

    // Clear the OTP so it can't be reused
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        revealOTP: null,
        revealOTPExpiresAt: null,
      },
    });

    const decryptedPassword = decrypt(savedPassword.password);

    res.status(200).json({
      website: savedPassword.website,
      username: savedPassword.username,
      password: decryptedPassword,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
