const router =require("express").Router();
const {verifyToken,verfiyTokenAndAuthorization, verfiyTokenAndAdmin}=require("../services/verifyToken.services")
const service=require("../services/users.services")

//update user
router.put("/:id",verfiyTokenAndAuthorization,service.updateUser)

//delete user
router.delete("/:id",verfiyTokenAndAuthorization,service.deleteUser)

//Get user
router.get("/find/:id",verfiyTokenAndAdmin,service.getUser)

//Get All User
router.get("/",verfiyTokenAndAdmin,service.getAllUser)

//User Stats
router.get("/stats",verfiyTokenAndAdmin,service.userStats)
module.exports=router