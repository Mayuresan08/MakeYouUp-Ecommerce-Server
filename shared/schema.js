const joi= require("joi")

const schema={

    userRegisterSchema:joi.object({
        username:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().min(6).required(),
        isAdmin:joi.boolean().default(false)
    }),

    userLoginSchema:joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(6).required()
    }),

    productSchema:joi.object({
        name:joi.string().required(),
        brand:joi.string().required(),
        description:joi.string().required(),
        product_type:joi.string().required(),
        rating:joi.number().required(),
        price:joi.number().required(),
        product_colors:joi.array(),
        image_link:joi.string().required()
    }),

  

}

module.exports=schema