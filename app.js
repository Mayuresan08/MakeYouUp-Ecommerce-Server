require("dotenv").config()
const express= require("express")
const cors=require("cors")
const mongo=require("./shared/mongo")
const app=express();
const authRoutes=require("./routes/auth.routes");
const userRoutes= require("./routes/users.routes");
const productRoutes=require("./routes/products.routes");
const cartRoutes=require("./routes/cart.routes");
const orderRoutes=require("./routes/orders.routes");
const stripeRoutes=require("./routes/stripe.routes");

(async()=>{

try{

app.use(cors())

app.use(express.json())

await mongo.connect()

const port =process.env.PORT||3001

app.get("/",(req,res)=>{
    res.status(200).send("Server is running successfully ")
})

app.use("/auth",authRoutes)

app.use("/users",userRoutes)

app.use("/product",productRoutes)

app.use("/cart",cartRoutes)

app.use("/order",orderRoutes)

app.use("/checkout",stripeRoutes)



app.listen(port,()=>{
    console.log("Server running in port 3001")
})
}
catch(err)
{
    console.log("Error in connecting to MongoDB",err)
}

})()