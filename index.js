const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000

//Middleware
app.use(cors());
app.use(express.json())

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9aibk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Motivo_Store');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const usersReviews = database.collection('reviews');
        const productsCollection = database.collection('products');


        //GET API For Orders Collection
        app.get('/ordersCollection', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })
        //GET API for all order show to display 
        app.get('/allOrdersCollection', async (req, res) => {
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        });
        //GET API for Products collection
        app.get('/productsCollection', async (req, res) => {
            const cursor = productsCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        });
        //GET API for user review
        app.get('/usersReviews', async (req, res) => {
            const cursor = usersReviews.find({})
            const result = await cursor.toArray()
            res.json(result)
        });
        //POST API for order collection
        app.post('/ordersCollection', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })
        //POST API for product collection
        app.post('/productsCollection', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            res.json(result)
        })
        //POST API for Review Section
        app.post('/usersReviews', async (req, res) => {
            const review = req.body;
            const result = await usersReviews.insertOne(review)
            res.json(result)
        })
        //GET API for certain user order show from  user Collection
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })
        //POST API For User Collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })
        //PUT API for make admin 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)

        })
        //FIND API For Single Orders Collection
        app.get('/ordersCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.findOne(query)
            res.json(result)
        })
        //FIND API For Single Products Collection
        app.get('/productsCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.json(result)
        })
        // DELETE API For Single Orders Collection
        app.delete('/ordersCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })
        // DELETE API For Single Products Collection
        app.delete('/productsCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query)
            res.json(result)
        })
        //Put API For Status Update
        app.put('/ordersCollection/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'approved' } }
            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.send(result)

        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello Motivo Store!')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})