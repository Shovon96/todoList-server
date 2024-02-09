const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    // credentials: true,
  })
);
app.use(express.json());

// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.5q3e1dy.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const taskCollection = client.db("taskify").collection("alltasks");

    // app.get('/tasks', async (req, res) => {
    //     const result = await taskCollection.find().toArray();
    //     res.send(result);
    //   });
    
    //get all the task
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await taskCollection
        .find(query)
        .sort({ priority: 1 })
        .toArray();
      res.send(result);
    });

    // create task
    app.post("/task", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});