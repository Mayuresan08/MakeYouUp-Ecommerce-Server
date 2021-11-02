const jwt= require("jsonwebtoken")




  function verifyToken(req,res,next){
    //   console.log("in token",req)
    const authHeader=req.headers.token
    // console.log(authHeader)
    if(! authHeader)return res.status(401).send("You are Not Authenticated")
    else{
        const token=authHeader
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) res.status(403).send("Token is not valid")
            req.user=user;
            next()
        })
    }
}

       function verfiyTokenAndAuthorization(req,res,next)
        {
            verifyToken(req,res,()=>{
                 console.log(req.user.userId,req.params)
            if(req.user.userId === req.params.userId || req.user.isAdmin)
            {
                next()
            }
            else{
                res.status(403).send("you are not allowed to do that")
            }
          })
        }


        function verfiyTokenAndAdmin(req,res,next)
        {
            verifyToken(req,res,()=>{
                // console.log(req.user)
            if( req.user.isAdmin)
            {
                next()
            }
            else{
                res.status(403).send("you are not allowed to do that")
            }
          })
        }

module.exports={verifyToken,verfiyTokenAndAuthorization,verfiyTokenAndAdmin}