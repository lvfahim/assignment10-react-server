const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = "mongodb+srv://Motorio:Qxw6VgKhFxAJTiA8@lvfahimnuman.wnfazhs.mongodb.net/?appName=LvFahimNuman";
// Qxw6VgKhFxAJTiA8
// Motorio
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const motorio = client.db('Motorio');
        const carDataCollection = motorio.collection('carData')
        const carBookingCollection = motorio.collection('carBooking')
        // Send a ping to confirm a successful connection
        // car Booking 
        app.post('/carBooking', async (req, res) => {
            const newBooking = req.body
            const result = await carBookingCollection.insertOne(newBooking)
            res.send(result)
        })
        app.get('/myBookingList', async (req, res) => {
            const email = req.query.email
            const quary = {}
            if (email) {
                quary.email = email
            }
            const cursor = carBookingCollection.find(quary).sort({ price: -1 })
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/myBook', async (req, res) => {
            const cursor = carBookingCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // Car Data 
        app.get('/carData', async (req, res) => {
            const cursor = carDataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/carDetails', async (req, res) => {
            const project = { category: 1, price: 1, name: 1, providerName: 1, image: 1 }
            const sort = { price: -1 }
            const cursor = carDataCollection.find().sort(sort).limit(8).project(project)
            const result = await cursor.toArray()
            res.send(result)

        })
        app.get('/carDetails/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await carDataCollection.findOne(quary)
            res.send(result)
        })
        app.get('/carDetailsForall', async (req, res) => {
            const project = { category: 1, price: 1, name: 1, providerName: 1, image: 1 }
            const sort = { price: -1 }
            const cursor = carDataCollection.find().project(project).sort(sort)
            const result = await cursor.toArray()
            res.send(result)

        })
        app.get('/myCarList', async (req, res) => {
            const email = req.query.email
            const quary = {}
            if (email) {
                quary.providerEmail = email
            }
            const cursor = carDataCollection.find(quary).sort({ price: -1 })
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/carData/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await carDataCollection.deleteOne(quary)
            res.send(result)
        })
        app.post('/carData', async (req, res) => {
            const newCarData = req.body
            const result = await carDataCollection.insertOne(newCarData);
            res.send(result)
        })
        app.patch('/carData/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCar = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updatedCar.name,
                    category: updatedCar.category,
                    price: updatedCar.price,
                }
            };
            const result = await carDataCollection.updateOne(query, update);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})