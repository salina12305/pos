
const User =require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/userroutes");


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
const getAllUsers  = async (req, res) =>{
    try {
        const user = await User.findAll({attributes: { exclude: ["password"] }})
        return res.json({
            success:true,
            message: "Users retrieved successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        });
   }
};

const getUsersById  = async (req, res) =>{
    try {
        const id = req.params.uid
        const user = await User.findByPk(id)
        if (!user) {
            return res.json({success:false, message: "User not found" })
          }
        return res.json({
            success:true,
            user: {id:user.id, name:user.username},
            message: "Users fetched successfully",
        })
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

module.exports={
    getAllUsers, addUser, getUsersById, updateUser
}

