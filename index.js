const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

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

    // change status
    app.put("/status", async (req, res) => {
      const id = req.query.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
    
    // delete task
    app.delete("/delete", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });

    // get single data
    app.get("/task", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const result = taskCollection.findOne(filter);
      res.send(result);
    });

    // update task
    app.put("/update", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const updatedDoc = {
        $set: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          deadline: data.deadline,
          email: data.email,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // handle logout
    app.post("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send({ success: true });
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