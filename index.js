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
            const products_collection = database.collection("products");

            // get product
            app.get("/products", async (req, res) => {
                  const project_fields = {
                        title: 1,
                        price_min: 1,
                        price_max: 1,
                        image: 1,
                  };
                  const cursor = products_collection
                        .find()
                        .sort({ price_min: -1 })
                        .skip(2)
                        .limit(5)
                        .project(project_fields);
                  // const cursor = products_collection.find()2
                  const result = await cursor.toArray();
                  res.send(result);
            });

            // get a product by id
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
