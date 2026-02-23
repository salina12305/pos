
const User =require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req,res) => {
    try{
        const{ username, email, password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const isUser = await User.findOne({ where: { username } });
        const isEmail = await User.findOne({ where: { email } });

        if(isUser || isEmail){
            return res.json({
                success:false,
                message:"User with this email exist!!"
            });
        }
        const hashedPassword = await  bcrypt.hash(password,10)
        console.log(hashedPassword)
        const newUser = await User.create({
            username: username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"User added successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
              },
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Error adding user",
            error:error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

const getUsersById  = async (req, res) =>{
    try {
        const id = req.params.uid;
        const user = await User.findByPk(id);
        if (!user)  return res(404).json({message: "User not found" });
        return res.json({
            id: user.id, 
            username: user.username, 
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        });
   }
};

const updateUser  = async (req, res) =>{
    try {
        const id = req.params.id;
        const {username, email, password}= req.body;
        const user = await User.findByPk(id);
        if (!user){
            return res.status(404).json({
                message:"User not found",
            });
        }
        if (username) {
            const isexistinguser = await User.findOne({ where: { username } })
            if (isexistinguser && isexistinguser.id !== user.id) {
              return res.status(400).json({
                success:false,
                message: "user with that username exist!",
              });
            }
        let hashedPassword= user.password;
        if(password){
            hashedPassword= await bcrypt.hash(password,10);
        }
        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
            });
        return res.status(200).json({
            success:true,
            message: "Users update successfully",
            user:{
                id:user.id
            },
        });
    }
    } catch (error) {
        return res.status(500).json({ 
            message: "Error updating users", 
            error: error.message 
        });
   }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
              success:false,
              message: "User not found",
            });
        }
          await user.destroy();
          return res.status(200).json({
            success:true,
            message: "User deleted successfully",
        });
    } catch (error) {
            return res.status(500).json({
              message: "Error deleting user",
              error: error.message,
            });
        }
};
const loginUser=async(req,res)=>{
    try{
        const {email,password,role}=req.body
        const user=await User.findOne({where:{email}})
        if (!user){
            return res.status(400).json({
              message: "Users not found!!"
            });
        }
        const isvalidUser = await bcrypt.compare(password,user.password)
        if (!isvalidUser){
            return res.status(400).json({
                message:"Invalid email or password!!"
            });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email, username:user.username },
            process.env.JWT_SECRET || "your_fallback_secret", 
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            success: true, 
            message: "User logged in successfully!",
            token,
            user: { 
                id: user.id,
                username: user.username,
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Saving token and 1-hour expiry to Sequelize DB
    user.verificationToken = resetToken;
    user.TokenExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset for your Nepal TrekMate account. Click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
      </div>
    `;

    await sendEmail(email, "Password Reset Request - Postify", htmlContent);
    res.status(200).json({success:true, message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const user = await User.findOne({
            where: {
                verificationToken: token,
                TokenExpires: {
                    [require('sequelize').Op.gt]: new Date() // TokenExpires must be > current time
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // 2. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update the user and clear the token fields
        user.password = hashedPassword;
        user.verificationToken = null;
        user.TokenExpires = null;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Password has been reset successfully! You can now login with your new password." 
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}; 

module.exports={
    getAllUsers, 
    addUser, 
    getUsersById, 
    updateUser, 
    deleteUser,
    loginUser,
    forgotPassword,
    resetPassword
}

