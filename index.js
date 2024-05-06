require('dotenv').config();
const express = require("express");
const cors =require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const uri = process.env.DB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const allProductsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);

    // all products get
    app.get("/allProducts", async(req, res)=>{
      try {
        const result = await allProductsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      }
    })

    // single products get
    app.get("/allProducts/:id", async(req,res)=>{
      try {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await allProductsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error");
      }
    })

    
    // Search by product name
    app.get("/productsName/:name", async (req, res) => {
      const name = req.params.name?.toLowerCase();
      let query = {};
      if (name)
      {
        query = { name: { $regex: name, $options: 'i' } };
      }

      try
      {
        const result = await allProductsCollection.find(query).toArray();
        res.send(result);
      } catch (error)
      {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal server error");
      }
    });

    // only category get
    app.get("/allProductsCategory", async(req,res)=>{
      try {
        const projection = { category : 1}
        const cursor = allProductsCollection.find().project(projection)
        const result = await cursor.toArray()
        res.send(result);
      } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error");
      }
    })

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res)=>{
  res.send(`Top fashion server is runnig on port ${port}`)
})

app.listen(port, ()=>{
  console.log(`Top fashion server is runnig on port ${port}`)
})