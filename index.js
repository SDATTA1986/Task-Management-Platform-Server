const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());



const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4qnhmwc.mongodb.net/?retryWrites=true&w=majority`;

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
        const taskCollection = client.db("TaskCollection").collection("Task");
        app.post("/addTask", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await taskCollection.insertOne(user);
            console.log(result);
            res.send(result);
          });

          app.get('/AllTasks',async(req,res)=>{
            const query={email:req.query.email}
            const result=await taskCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/Tasks/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const result=await taskCollection.deleteOne(query);
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }

}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("CRUD is running....");
})

app.listen(port, () => {
    console.log(`App is running on PORT: ${port}`);
})