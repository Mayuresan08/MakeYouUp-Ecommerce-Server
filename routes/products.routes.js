const router =require("express").Router();
const {verifyToken,verfiyTokenAndAuthorization, verfiyTokenAndAdmin}=require("../services/verifyToken.services")
const service=require("../services/product.services")

//create Product
router.post("/",verfiyTokenAndAdmin, service.createProduct)

//Update Product
router.put("/:id",verfiyTokenAndAuthorization,service.updateProduct)

//Delete Product
router.delete("/:id",verfiyTokenAndAdmin,service.deleteProduct)

//get Product
router.get("/find/:id",service.getProduct)

//get all Product
router.get("/",service.getAllProduct)


module.exports=router