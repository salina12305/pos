// // const User =require("../models/usermodel")
// // const bcrypt = require("bcrypt")

// // const addUser = async (req,res) => {
// // // const addUser = async (req,res) => {
// //     try{
// //         const{ username, email, password}=req.body;
// //         if(!username || !email || !password){
// //             return res.status(400).json({
// //                 message:"All fields are required"
// //             });
// //         }
// //         const hassed = await  bcrypt.hash(password,10)
// //         const newUser = await User.create({
// //             username,
// //             email,
// //             password:hassed
// //         });
// //         res.status(201).json({
// //             message:"User added successfully",
// //             newUser
// //         });
// //     } catch (error){
// //         res.status(500).json({
// //             message: "Error adding user",
// //             error:error.message
// //         });
// //     }
// // ;}

// // module.exports={
// //     // getAllUsers,getAllProduct,
// //     addUser
// // }

// const User =require("../models/usermodel")
// const bcrypt = require("bcrypt")

// const addUser = async (req,res) => {
// // const addUser = async (req,res) => {
//     try{
//         const{ username, email, password}=req.body;
//         if(!username || !email || !password){
//             return res.status(400).json({
//                 message:"All fields are required"
//             });
//         }
//         const isUser = await User.findOne({where:(username)})
//         const isEmail = await User.findOne({where:(email)})

//         if(isUser || isEmail){
//             return res.json({msg:"user with this email exist!!" })
//         }
//         const hassed = await  bcrypt.hash(password,10)
        
//         const newUser = await User.create({
//             username,
//             email,
//             password:hassed
//         });
//         res.status(201).json({
//             message:"User added successfully",
//             newUser
//         });
//     } catch (error){
//         res.status(500).json({
//             message: "Error adding user",
//             error:error.message
//         });
//     }
// };

// const getAllUsers  = async (req, res) =>{
//     const user = user.findAll({})
//     res.json({user,message:"User fetched successfully"})

// };

// const getActiveUsers = async (req, res) =>{
//     res.json({message:"this is the getUser request"});
// };

// module.exports={
//     getAllUsers,getActiveUsers, addUser
// }

const User =require("../models/usermodel")
const bcrypt = require("bcrypt")

const addUser = async (req,res) => {
// const addUser = async (req,res) => {
    try{
        const{ username, email, password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const isUser = await User.findOne({where:(username)})
        const isEmail = await User.findOne({where:(email)})

        if(isUser || isEmail){
            return res.json({msg:"user with this email exist!!" })
        }
        const hassed = await  bcrypt.hash(password,10)
        
        const newUser = await User.create({
            username,
            email,
            password:hassed
        });
        res.status(201).json({
            message:"User added successfully",
            newUser
        });
    } catch (error){
        res.status(500).json({
            message: "Error adding user",
            error:error.message
        });
    }
};
const getAllUsers  = async (req, res) =>{
    try {
        const users = await User.findAll({attributes: { exclude: ["password"] }});
        res.status(200).json({
            message: "Users retrieved successfully",
            users
        })
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        })
   }
};

const getUsersById  = async (req, res) =>{
    try {
        const id = req.params.uid
        const users = await User.findByPk(id)
        return res.json({
        // res.status(200).json({
            user: {id:users.id, name:users.username},
            message: "Users fetched successfully",
            
        })
    } catch (error) {
        return res.status(500).json({ 
        // res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        });
   }
};

const getActiveUsers = async (req, res) =>{
    res.json({message:"this is the getUser request"});
};

const updateUser  = async (req, res) =>{
    try {
        const {id} = req.params;
        const {username, email, password}= req.body;
        const users = await User.findByPk(id);
        if (!users){
            return res.status(404).json({
                message:"User not found",
            });
        }
        let hashedPassword= users.password;
        if(password){
            hashedPassword= await bcrypt.hash(password,10);
        }
        await users.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
                });
        return res.status(200).json({
        // res.status(200).json({
            
            message: "Users update successfully",
            users,
        });
    } catch (error) {
        return res.status(500).json({ 
       
            message: "Error updating users", 
            error: error.message 
        });
   }
}; 

module.exports={
    getAllUsers,getActiveUsers, addUser, getUsersById, updateUser
}

