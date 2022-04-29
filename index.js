const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
            res.send(await cursor.toArray());
        })

    }

    finally { }
}
run().catch(console.dir);
