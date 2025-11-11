const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const motorio=client.db('Motorio');
        const carDataCollection=motorio.collection('carData')
        // Send a ping to confirm a successful connection
        app.get('/carData', async (req,res)=>{
            const cursor= carDataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/carDetails', async(req,res)=>{
            const project={category:1,price:1,name:1,providerName:1,image:1}
            const sort = {price:-1}
            const cursor = carDataCollection.find().limit(8).project(project).sort(sort)
            const result = await cursor.toArray()
            res.send(result)
            
        })
        app.post('/carData', async (req,res)=>{
            const newCarData = req.body
            const result = await carDataCollection.insertOne(newCarData);
            res.send(result)
        })
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