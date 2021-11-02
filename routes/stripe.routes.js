const router=require("express").Router()
const service=require("../services/stripe.services")


router.post("/payment",service.payment)

module.exports=router