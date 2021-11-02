const mongo=require("../shared/mongo")
const {ObjectId}=require("mongodb")

const service={

    //Create Cart
    async createOrder(req,res)
    {
        try{
            let order={...req.body,createdAt:new Date()}
            const createdOrder=await mongo.orders.insertOne(order)
            console.log(createdOrder)
            res.status(201).send(createdOrder)
            
        }
        catch(err)
        {
            console.log("Error in Creating Order",err)
            res.status(500).send(err)
        }
    },

    //update Order
    async updateOrder(req,res)
    {
        try{
            console.log(req.params.id)
            const updatedOrder= await mongo.orders.findOneAndUpdate({_id:ObjectId(req.params.id)},{$set:req.body},{ReturnDocument: "after" })
            console.log(updatedOrder)
            res.status(200).send(updatedOrder)
        }
        catch(err)
        {
            console.log("Error in Updating Order",err)
            res.status(500).send(err)
        }
    },

    //Delete Order
    async deleteOrder(req,res)
        {
            try{
                
                await mongo.orders.deleteOne({_id:ObjectId(req.params.id)})
                res.status(200).send("Order Deleted")
            }
            catch(err)
            {
                console.log("Error in Deleting Orders",err)
                res.status(500).send(err)
            }
        
    },
    
    //Get User Cart
    async getOrder(req,res)
        {
            try{
                
                const order=await mongo.orders.find({userId:req.params.userId}).toArray()
                console.log(order)
                res.status(200).send(order)
            }
            catch(err)
            {
                console.log("Error in fetching user order",err)
                res.status(500).send(err)
            }
        
    },

    //get all User Orders upto 5
    async getAllOrder(req,res)
    {
        try{
            const orders=await mongo.orders.find().limit(5).toArray()
            res.status(200).send(orders)
        }
        catch(err)
        {
            console.log("Error in fetching all user orders",err)
            res.status(500).send(err)  
        }
    },


    //get Monthly income
    async getIncome(req,res)
    {
        const date=new Date()
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonthBefore = new Date(new Date().setMonth(lastMonth.getMonth() - 2));
      
        try {

            const income=await mongo.orders.aggregate([
                {$match:{createdAt:{$gte:previousMonthBefore}}},
                {
                    $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                }},
                {
                    $group:{
                        _id:"$month",
                        total :{$sum:"$sales"},
                    }
                }
            ]).toArray()
            res.status(200).send(income)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}

module.exports=service