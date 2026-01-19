
const router = require("express").Router();

const { addUser, 
    getAllUsers,
    getUsersById,
    updateUser,
    deleteUser,
    loginUser
 } = require('../controllers/userController')

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/getallUsers", getAllUsers);
router.get("/getUserByid/:uid", getUsersById);
router.put("/updateUserByid/:id",updateUser);

module.exports=router;