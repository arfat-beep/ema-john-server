const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// set url which will connect to the main database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s38s3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    // connect with database and collection
    await client.connect();
    const productCollection = client.db("emaJohn").collection("product");

    // get all products from database
    app.get("/products", async (req, res) => {
      console.log("query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      let products;
      const cursor = productCollection.find(query);
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    // get total data length of this collection
    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // use post to get by ids
    app.post("/productByKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();

      console.log(keys);
      res.send(products);
    });
  } finally {
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Ema John is running");
});
app.listen(port, () => {
  console.log("John is running on port", 5000);
});
// username : ema-john
// password : 1m1YAwvO09RIUMno
