const mongo=require("../shared/mongo")
const {ObjectId}=require("mongodb")

const service={

    //Create Cart
    async createCart(req,res)
    {
        try{
            const cart=await  mongo.cart.insertOne(req.body)
            console.log(product)
            res.status(201).send(cart)
            
        }
        catch(err)
        {
            console.log("Error in Creating Cart",err)
            res.status(500).send(err)
        }
    },

    //update cart
    async updateCart(req,res)
    {
        try{
            console.log(req.params.id)
            const updatedCart= await mongo.cart.findOneAndUpdate({_id:ObjectId(req.params.id)},{$set:req.body},{ReturnDocument: "after" })
            console.log(updatedCart)
            res.status(200).send(updatedCart)
        }
        catch(err)
        {
            console.log("Error in Updating cart",err)
            res.status(500).send(err)
        }
    },

    //Delete Cart
    async deleteCart(req,res)
        {
            try{
                
                await mongo.cart.deleteOne({_id:ObjectId(req.params.id)})
                res.status(200).send("Cart Deleted")
            }
            catch(err)
            {
                console.log("Error in Deleting Cart",err)
                res.status(500).send(err)
            }
        
    },
    
    //Get User Cart
    async getCart(req,res)
        {
            try{
                
                const cart=await mongo.cart.findOne({userId:ObjectId(req.params.userId)})
                res.status(200).send(cart)
            }
            catch(err)
            {
                console.log("Error in fetching user carts",err)
                res.status(500).send(err)
            }
        
    },

    //get all User cart
    async getAllCart(req,res)
    {
        try{
            const carts=await mongo.cart.find().toArray()
            res.status(200).send(carts)
        }
        catch(err)
        {
            console.log("Error in fetching all user carts",err)
            res.status(500).send(err)  
        }
    }


}

module.exports=service