const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"Password Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Password Manager account",
    html: `
      <h2>Welcome to Password Manager!</h2>

      <p>Click the button below to verify your email.</p>

      <a href="${verificationLink}"
         style="
           background:#2563eb;
           color:white;
           padding:12px 20px;
           text-decoration:none;
           border-radius:6px;
         ">
         Verify Email
      </a>

      <p>If you didn't create this account, you can ignore this email.</p>
    `,
  });
}




async function sendOTPEmail(email, otp) {
  await transporter.sendMail({
    from: `"Password Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>

      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
  });
}


module.exports = {
  sendVerificationEmail,
  sendOTPEmail,
};