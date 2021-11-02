const service = require("../services/order.services");
const { verfiyTokenAndAdmin,verifyToken,verfiyTokenAndAuthorization } = require("../services/verifyToken.services");

const router =require("express").Router();

//create order
router.post("/",verifyToken,service.createOrder)

//update order
router.put("/id",verfiyTokenAndAdmin,service.updateOrder)

//delete order
router.delete("/:id",verfiyTokenAndAdmin,service.deleteOrder  )

//get user order
router.get("/find/:userId",verfiyTokenAndAuthorization,service.getOrder)

//get All users order
router.get("/",verfiyTokenAndAdmin,service.getAllOrder)

//get monthly income
router.get("/income",verfiyTokenAndAdmin,service.getIncome)

module.exports=router