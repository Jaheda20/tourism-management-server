const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.al6znur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const userCollection = client.db("userDB").collection("user");
    const spotCollection = client.db("spotDB").collection("spot");
    const countryCollection = client.db("countryDB").collection("country")

    // user related API
    app.get('/user', async(req, res) =>{
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    app.post('/user', async(req, res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    // products related API

    app.get('/addSpots', async(req, res) =>{
        const cursor = spotCollection.find();
        const spots = await cursor.toArray();
        res.send(spots)
    })

    app.get('/addSpots/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await spotCollection.findOne(query)
        res.send(result)
    })
    
    app.post('/addSpots', async(req, res) => {
        const spot = req.body;
        console.log(spot)
        const result = await spotCollection.insertOne(spot)
        res.send(result)
    })

    app.get('/myList/:email', async(req, res) =>{
        const email = req.params.email;
        console.log(email)
        const mySpots = await spotCollection.find({email}).toArray();
        res.send(mySpots) 
    })

    app.put('/updateSpot/:id', async(req, res) =>{
        const id = req.params.id;
        console.log(id)
        const filter = {_id: new ObjectId(id) }
        const options = { upsert: true};
        const updatedSpot = req.body;
        const spot = {
            $set: {
                photo: updatedSpot.photo,
                spotName: updatedSpot.spotName,
                country: updatedSpot.country,
                location: updatedSpot.location,
                season: updatedSpot.season,
                duration: updatedSpot.duration,
                visitors: updatedSpot.visitors,
                cost: updatedSpot.cost,
                description: updatedSpot.description,
            }
        }
        const result = await spotCollection.updateOne(filter, spot, options)
        res.send(result)
    })

    app.delete('/delete/:id', async(req, res) =>{
        const id = req.params.id;
        console.log(id)
        const query = {_id: new ObjectId(id)}
        const result = await spotCollection.deleteOne(query)
        res.send(result)
    })

    // country api
    app.get('/country', async(req, res) =>{
        const cursor = countryCollection.find();
        const countries = await cursor.toArray();
        res.send(countries)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) =>{
    res.send('Tourism Management Server is Running')
})

app.listen(port, () =>{
    console.log(`Tourism Management Server is running on port ${port}`)
})