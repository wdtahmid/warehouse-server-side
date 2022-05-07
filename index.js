const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');


app.get('/', (req, res) => {
    res.send('Server running...');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access!' })
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            res.status(403).send({ Message: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tn8zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {


    try {

        await client.connect();
        const inventories = client.db("inventory").collection("products");

        //Auth
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            })
            res.send(accessToken)
        })

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
        app.delete('/myitems/:id', async (req, res) => {
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

        app.get('/myitems', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.userEmail;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email }
                const result = await inventories.find(query).toArray();
                res.send(result)
            } else {
                res.status(403).send({ Message: 'Forbidden Access' })
            }
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
