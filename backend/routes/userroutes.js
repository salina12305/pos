
const router = require("express").Router();

// Importing controller functions
const { addUser, 
    getAllUsers,
    getUsersById,
    updateUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require('../controllers/userController')

// AUTHENTICATION ROUTES
router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/getallUsers", getAllUsers);
router.get("/getUserByid/:uid", getUsersById);
router.put("/updateUserByid/:id",updateUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports=router;