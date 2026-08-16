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

            // creating a database
            const database = client.db("smart_deals_db");

            // creating a collection for products
            const products_collection = database.collection("products");

            // creating a collection for bids collection
            const bids_collection = database.collection("bids");

            // creating a collection for user data
            const users_collection = database.collection("users");

            // products related apis
            // get all product
            app.get("/products", async (req, res) => {
                  const project_fields = {
                        title: 1,
                        price_min: 1,
                        price_max: 1,
                        image: 1,
                  };
                  // const cursor = products_collection
                  //       .find()
                  //       .sort({ price_min: -1 })
                  //       .skip(2)
                  //       .limit(5)
                  //       .project(project_fields);

                  console.log(req.query);
                  const email = req.query.email;

                  const query = {};
                  if (email) {
                        query.email = email;
                  }

                  const cursor = products_collection.find(query);
                  const result = await cursor.toArray();
                  res.send(result);
            });

            // get a single product by id
            app.get("/products/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await products_collection.findOne(query);
                  res.send(result);
            });

            // add products
            app.post("/products", async (req, res) => {
                  const new_product = req.body;
                  const result =
                        await products_collection.insertOne(new_product);
                  res.send(result);
            });

            // update product
            app.patch("/products/:id", async (req, res) => {
                  const id = req.params.id;
                  const updated_product = req.body;
                  const query = { _id: new ObjectId(id) };

                  const update = {
                        $set: {
                              name: updated_product.name,
                              price: updated_product.price,
                        },
                  };
                  const result = await products_collection.updateOne(
                        query,
                        update,
                  );
                  res.send(result);
            });

            // delete product
            app.delete("/products/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await products_collection.deleteOne(query);
                  res.send(result);
            });

            // bids related apis
            // get all bids
            app.get("/bids", async (req, res) => {
                  const email = req.query.email;
                  const query = {};
                  if (email) {
                        query.buyer_email = email;
                  }

                  const cursor = bids_collection.find(query);
                  const result = await cursor.toArray();
                  res.send(result);
            });

            // get single bid by id
            app.get("/bids/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await bids_collection.findOne(query);
                  res.send(result);
            });

            // post a bids
            app.post("/bids", async (req, res) => {
                  const new_bid = req.body;
                  const result = await bids_collection.insertOne(new_bid);
                  res.send(result);
            });

            // delete a bids
            app.delete("/bids/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await bids_collection.deleteOne(query);
                  res.send(result);
            });

            // user related apis
            // get all users data
            app.get("/users", async (req, res) => {
                  const cursor = users_collection.find();
                  const result = await cursor.toArray();
                  res.send(result);
            });

            // get user data by id
            app.get("/users/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await users_collection.findOne(query);
                  res.send(result);
            });
            // insert user data
            app.post("/users", async (req, res) => {
                  const new_user = req.body;
                  const result = await users_collection.insertOne(new_user);
                  res.send(result);
            });

            // update user data
            app.patch("/users/:id", async (req, res) => {
                  const id = req.params.id;
                  const updated_user = req.body;
                  const query = { _id: new ObjectId(id) };
                  const update = {
                        $set: updated_user,
                  };
                  const result = await users_collection.updateOne(
                        query,
                        update,
                  );
                  res.send(result);
            });

            // delete user data
            app.delete("/users/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await users_collection.deleteOne(query);
                  res.send(result);
            });

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
