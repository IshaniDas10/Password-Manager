const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const {
  sendVerificationEmail,
  sendOTPEmail,
} = require("../utils/emailService");


// Signup controller
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
const verificationToken = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create user
    const newUser = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    verificationToken,
  },
});

await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
  message: "Account created. Please check your email to verify your account.",
});


  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};




// Login controller
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;


    // Check input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    // Find user by email  <-- HERE
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });


    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
       message: "Please verify your email before logging in.",
      });
    }
    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    
    const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
  );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
};


// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link.",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        forgotPasswordOTP: otp,
        forgotPasswordExpiresAt: expiresAt,
      },
    });

    // TEMPORARY: Show OTP in terminal
    await sendOTPEmail(email, otp);

res.status(200).json({
  message: "OTP sent successfully. Please check your email.",
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
  // Verify Forgot Password OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check OTP
    if (user.forgotPasswordOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (new Date() > user.forgotPasswordExpiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check input
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forgotPasswordOTP: null,
        forgotPasswordExpiresAt: null,
      },
    });

    res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
