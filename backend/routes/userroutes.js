

const express= require("express").Router();

const { addUser, getAllUsers,getUsersById,updateUser } = require('../controllers/userController')

express.post("/register", addUser);
express.get("/getallUsers", getAllUsers);
express.get("/getUserByid/:uid", getUsersById);
express.put("/updateUserByid/:id",authGuard,isAdmin,updateUser);

module.exports=express;