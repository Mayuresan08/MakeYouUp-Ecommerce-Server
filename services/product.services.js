const mongo=require("../shared/mongo")
const {ObjectId}=require("mongodb")
const {productSchema} =require("../shared/schema")
const service={

    //Create Product
    async createProduct(req,res){

        try{
            
            const {value,error}=await productSchema.validate(req.body)

            if(error)  res.status(400).send({Error:error.details[0].message})

            const product=mongo.products.insertOne(value)
            console.log(product)
            res.status(201).send("Product Created")
        }
        catch(err)
        {
            console.log("Error in Creating Product",err)
            res.status(500).send(err)
        }

    },

    //Update Product
    async updateProduct(req,res)
    {
        try{
            console.log(req.params.id)
            const updatedProduct= await mongo.products.findOneAndUpdate({_id:ObjectId(req.params.id)},{$set:req.body},{ReturnDocument: "after" })
            console.log(updatedProduct)
            res.status(200).send(updatedProduct)
        }
        catch(err)
        {
            console.log("Error in Updating Product",err)
            res.status(500).send(err)
        }
    },

    //Delete Product
    async deleteProduct(req,res)
        {
            try{
                
                await mongo.products.deleteOne({_id:ObjectId(req.params.id)})
                res.status(200).send("Product Deleted")
            }
            catch(err)
            {
                console.log("Error in Deleting Product",err)
                res.status(500).send(err)
            }
        
    },

    //get Product
    async getProduct(req,res)
        {
            try{
                
                const product=await mongo.products.findOne({_id:ObjectId(req.params.id)})
                res.status(200).send(product)
            }
            catch(err)
            {
                console.log("Error in fetching a Product",err)
                res.status(500).send(err)
            }
        
    },

    //get All Product
    async getAllProduct(req,res)
    {
        try {
            
            if(Object.keys(req.query).length === 0)
            {

                let products= await mongo.products.find().toArray()
                res.status(200).send(products)
            }
            else
            {
                let query={}
                query['$and']=[]
                let sort,products;
                for(let key in req.query)
                {
                    console.log(key,req.query)
                    if(key === "sort")
                    {
                     sort=req.query[key]
                    }
                    else if(key === "name")
                    {
                        query['$and'].push({name:{$regex: req.query[key],$options:'i'}})
                    }
                     else if(key === "price")
                    {
                        values=req.query[key].split(",")
                        values=values.map((a)=>parseInt(a))
                        query['$and'].push({[key]:{$lt:values[1],$gte:values[0]}})
                    
                    }
                    else 
                    {
                        query['$and'].push({[key]:{$in:req.query[key].split(",")}})  
                    } 
                }

                console.log(query)
                
                 if(sort && query['$and'].length == 0)
                {
                    sort === "high"? 
                    products= await mongo.products.find().sort({price:-1}).toArray():
                    products= await mongo.products.find().sort({price:1}).toArray()
                }
                else if(sort && query['$and'].length > 0 )
                {
                    sort === "high"? 
                     products= await mongo.products.find(query).sort({price:-1}).toArray():
                     products= await mongo.products.find(query).sort({price:1}).toArray()
                }
                else products= await mongo.products.find(query).toArray()
                res.status(200).send(products)
                
            }
        }
         catch (err) {
            console.log("Error in fetching all Products",err)
            res.status(500).send(err)
        }
    }

}

module.exports=service