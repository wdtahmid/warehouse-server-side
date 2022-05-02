const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');


app.get('/', (req, res) => {
    res.send('Server running...');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tn8zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {


    try {

        await client.connect();
        const inventories = client.db("inventory").collection("products");

        app.post('/additem', async (req, res) => {
            const item = req.body;
            const result = await inventories.insertOne(item);
            res.send(result);
            console.log(result);
        });

        app.get('/manageinventories', async (req, res) => {
            const query = {};
            const cursor = inventories.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        app.delete('/manageinventories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventories.deleteOne(query);
            res.send(result)
            console.log(result);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventories.findOne(query);
            res.send(result);
        })

        app.put('/inventory-deliverd/:id', async (req, res) => {
            const updatedInfo = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateQuantity = {
                $set: {
                    quantity: updatedInfo.quantity,
                },
            }
            const result = await inventories.updateOne(filter, updateQuantity, options);
            res.send(result)
        });
        app.put('/inventory-restock/:id', async (req, res) => {
            const updatedInfo = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateQuantity = {
                $set: {
                    quantity: updatedInfo.quantity,
                },
            }
            const result = await inventories.updateOne(filter, updateQuantity, options);
            res.send(result)
        });

    }

    finally { }
}
run().catch(console.dir);
