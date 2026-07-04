const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });


    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
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