// const express= require("express").Router();

// const { addUser } = require('../controllers/userController')

// //get request is used to access data/ smth from client 
// // express.get("/getallUsers", addUser);

// //post request
// express.post("/register", addUser);

// module.exports=express;

const express= require("express").Router();

const { addUser } = require('../controllers/userController')
// const { getActiveUsers } = require('../controllers/userController')
const { getAllUsers } = require('../controllers/userController')
const { getUsersById } = require('../controllers/userController')

//get request is used to access data/ smth from client 
// express.get("/getallUsers", addUser);

//post request
express.post("/register", addUser);
// express.post("/register", getActiveUsers);
express.get("/getallUsers", getAllUsers);
express.get("/getUserByid/:uid", getUsersById);

module.exports=express;