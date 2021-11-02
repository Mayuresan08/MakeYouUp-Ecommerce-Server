const {MongoClient} = require("mongodb")

const client= new MongoClient(process.env.MONGODB_URL)

module.exports={

    db:null,
    users:null,
    products:null,
    orders:null,
    cart:null,

    async connect()
    {
        await client.connect()
        console.log("connected to DB",process.env.MONGODB_URL)

        this.db=client.db(process.env.MONGODB_NAME)
        console.log("Database Selected",process.env.MONGODB_NAME)


        this.users=this.db.collection("users")
        this.products=this.db.collection("products")
        this.orders=this.db.collection("orders")
        this.cart=this.db.collection("cart")

    }

}
