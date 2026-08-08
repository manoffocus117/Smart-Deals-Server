require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      },
});

app.get("/", (req, res) => {
      res.send("server is running");
});

//
async function run() {
      try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();

            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Successfully connected to MongoDB!");
      } catch (error) {
            console.log(error);
      }
}
run();

app.listen(port, () => {
      console.log(`server is running on port ${port}`);
});
