const router =require("express").Router();
const service =require("../services/cart.services");
const { verifyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("../services/verifyToken.services");

//create cart
router.post("/",verifyToken,service.createCart)

//update Cart
router.put("/id",verfiyTokenAndAuthorization,service.updateCart)

//delete cart
router.delete("/:id",verfiyTokenAndAuthorization,service.deleteCart  )

//get user Cart
router.get("/find/:userId",verfiyTokenAndAuthorization,service.getCart)

//get All users cart
router.get("/",verfiyTokenAndAdmin,service.getAllCart)

module.exports=router