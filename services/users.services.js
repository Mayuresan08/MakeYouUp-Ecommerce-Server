const mongo=require("../shared/mongo")
const bcrypt=require("bcrypt")
const {ObjectId}=require("mongodb")

const service={

//update user
    async updateUser(req,res)
    {
        try{
            if(req.body.password)
            {
                req.body.password=await bcrypt.hash(req.body.password,Number(12))
            }
            console.log(req.user.userId)
            const updatedUser= await mongo.users.findOneAndUpdate({_id:ObjectId(req.user.userId)},{$set:req.body},{ReturnDocument: "after" })
            console.log(updatedUser)
            res.status(200).send(updatedUser)
        }
        catch(err)
        {
            console.log("Error in Updating User",err)
            res.status(500).send(err)
        }
    },

    //Delete User
    async deleteUser(req,res)
        {
            try{
                
                await mongo.users.deleteOne({_id:ObjectId(req.params.id)})
                res.status(200).send("User Deleted")
            }
            catch(err)
            {
                console.log("Error in Deleting User",err)
                res.status(500).send(err)
            }
        
    },
    //Get User
    async getUser(req,res)
        {
            try{
                
                const user=await mongo.users.findOne({_id:ObjectId(req.params.id)})

                const {password,...others}=user
                // console.log("in",user,others)
                res.status(200).send({...others})
            }
            catch(err)
            {
                console.log("Error in fetching a User",err)
                res.status(500).send(err)
            }
        
    },
    //Get All User
    async getAllUser(req,res)
        {
            const query=req.query.new

            try{
                
                const users= query? await mongo.users.find().sort({_id:-1}).limit(5).toArray() :await mongo.users.find().toArray()
                console.log(users)
                res.status(200).send(users)
            }
            catch(err)
            {
                console.log("Error in fetching all Users",err)
                res.status(500).send(err)
            }
        
    },

    //get user Stats
    async userStats(req,res)
    {
        const date= new Date()
        const lastYear = new Date(date.setFullYear(date.getFullYear()-1))

        try{

            const data=await  mongo.users.aggregate([
                {$match:{ createdAt:{$gte:lastYear}}},
                {$project:{
                    month:{$month:"$createdAt"}
                }},
                {$group:{_id:'$month',total:{$sum:1}}}
            ]).toArray()

            console.log(data)
            res.status(200).send(data)
        }
        catch(err)
        {
            res.status(500).send(err)
        }
    }

}

module.exports=service