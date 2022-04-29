const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Server running...');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tn8zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Database connected');
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
