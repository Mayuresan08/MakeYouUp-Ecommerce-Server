//importing mongodb driver 
const mongo=require("../shared/mongo")
//importing joi validation
const {userRegisterSchema ,userLoginSchema} =require("../shared/schema")
//importing Bcrypt Module
const bcrypt=require("bcrypt")
//importing jwt module
const jwt=require("jsonwebtoken")
//importing crypto module
const crypto=require("crypto")

const {ObjectId}=require("mongodb")
const sendMail=require('../shared/sendMailer')


const service={

async register(req,res){
    try{

        //validating with Register schema
        const {value,error}= await userRegisterSchema.validate(req.body)
        console.log(value,error)
        //Error in schema
        if(error) return res.status(400).send({Error:error.details[0].message})

        //check if user already exists
        let user=await mongo.users.findOne({email:value.email})
        if(user) return res.status(400).send({Error:"user already exists"})

        //hash password using bcrypt
        value.password=await bcrypt.hash(value.password,Number(12))

       
        //    if(!value.isAdmin)  value={...value,isAdmin:false}
        let newUser={...value,createdAt:new Date()}
        const insertedData = await mongo.users.insertOne(newUser)
        console.log("in",insertedData)
        

        res.status(201).send("user registered")
    }
    catch(err)
    {
        console.log("Error in registering user")
        res.status(500).send({err})
    }
},

    async login(req,res){

    try{
        //validating JOI login schema
        const {value,error}=userLoginSchema.validate(req.body)
        if(error) res.status(400).send({Error:error.details[0].message})
        console.log(value)
        //check email exists
        const user=await mongo.users.findOne({email:value.email})
        if(!user) return res.status(400).send({error:"user not found,Please sign up"})
        console.log(user)
        //check password
        const isValid= await bcrypt.compare(value.password,user.password)
        if(!isValid)  return res.status(400).send("Incorrect Email/Password")

        //creating token
        const token =await  jwt.sign(
            {
                userId:user._id,
                username:user.username,
                isAdmin:user.isAdmin
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn:"2d"}
        )

        const {password,...others}=user
        console.log(others)
        //sending response
        res.status(200).send({token,...others})
    }
    catch(err)
    {
        console.log("Error in Login")
            res.status(500).send({err})
    }

    },

    async resetToken(req,res)
    {
        
        let user= await mongo.users.findOne({email:req.body.email})
        console.log(user)
        if(!user) res.status(400).send("User doesnot exists")
        
        if(user.resetToken) 
        {
            let data= await mongo.users.update({email:user.email},{$unset:{resetToken:1,resetExpire:1}})
            console.log(data)
        }
        // creating a string and hashing using bcrypt
        let token=crypto.randomBytes(32).toString("hex")
        let hashToken=await bcrypt.hash(token,Number(12))
        console.log(token,hashToken)
        //creating expiry after 1 hour
        let expiry= new Date(Date.now()+ (1*3600*1000) )
        //updating the users table with resetToken and resetExpire
        let data= await mongo.users.findOneAndUpdate({email:user.email},{$set:{resetToken:hashToken,resetExpire:expiry}},{ReturnDocument: "after" })
        console.log(data)
    
        const link=`https://mayu-makeyouup.netlify.app/resetPassword/${user._id}/${token}`
        
        await sendMail(user.email,"Password Reset",link)
        
        res.status(200).send("Link sent to email")  
    },

    async verifyAndUpdatePassword(req,res)
    {
        try{

        
        let user= await mongo.users.findOne({_id:ObjectId(req.params.userId)});
    if(!user.resetToken) return res.status(400).send("Invalid link or expired")

    let token=req.params.token

    const isValid= await bcrypt.compare(token,user.resetToken)
    const expire =   user.resetExpire > Date.now()
     console.log(Date.now(), user.resetExpire.getTime(),expire)
     if( isValid &&  expire )
     {
         const password =req.body.password;
         const hashPassword =await bcrypt.hash(password,Number(12))
         console.log(hashPassword)
         let data= await mongo.users.findOneAndUpdate({_id:ObjectId(req.params.userId)},{$set:{password:hashPassword},$unset:{resetToken:1,resetExpire:1}},{ReturnDocument: "after" })
         console.log(data)
         res.status(200).send("password updated successfully")
     }
     else res.status(400).send("Invalid link or expired")
    }
    catch(err)
    {
        res.status(500).send(err)
    }
    }
}



module.exports=service