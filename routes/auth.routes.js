const router =require("express").Router();

const service= require("../services/auth.services")

//register user
router.post("/register",service.register)

//login user
router.post("/login",service.login)

//generating resetPasswordToken
router.post("/resetToken",service.resetToken)

//verify reset token and change password
router.post("/verifyAndUpdatePassword/:userId/:token",service.verifyAndUpdatePassword)

module.exports=router