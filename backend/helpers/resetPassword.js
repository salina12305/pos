const User = require("../models/UserModels")
const bcrypt = require("bcrypt")

// Resets user password using a verification token
const resetPassword = async (req, res) => {
  try {
    // 1. Extract token and new password from request body
    const { token, password } = req.body;

    // 2. Immediate validation: Ensure both fields are provided
    if (!token || !password) {
      return res.status(400).json({
        message: "token or password cannot be null"
      });
    }

    // 3. Find the user associated with this specific token
    const user = await User.findOne({
      where: { verificationToken: token }
    });

    // 4. If no user is found, the token is either wrong or already used
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // 5. Securely hash the new password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Update user record: Set new password and invalidate the token
    user.password = hashedPassword;
    user.verificationToken = null;  // Important: prevents the same token from being used twice
    // 7. Persist changes to the database
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    // 8. Catch any unexpected database or server errors
    return res.status(500).json({
      message: "Server error while resetting password",
      error: error.message,
    });
  }
}

module.exports = resetPassword;