const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddlqajr.mongodb.net/?retryWrites=true&w=majority`;

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
    //await client.connect();

    const userCollection = client.db("taskDB").collection("users");

    //jwt related api
    /* app.post('/jwt', async(req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.TOKEN_ACCESS, {expiresIn: '1h'});
        res.send({token});
      })
  
      //middlewares
      const verifyToken = (req, res, next) =>{
        //console.log("inside verify", req.headers.authorization)
        if(!req.headers.authorization){
          return res.status(401).send({message: 'unauthorized access'})
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_ACCESS, (err, decoded)=>{
          if(err){
            return res.status(401).send({message: 'unauthorized access'})
          }
          req.decoded = decoded;
          next();
        })
      } */

    //get user
    app.get('/users', async(req,res)=>{
        //console.log(req.headers)
        const result = await userCollection.find().toArray();
        res.send(result);
    })

    //user 
    app.post('/users', async(req, res) =>{
        const user = req.body;
        const query = {email: user.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
          return res.send({message: 'user Already add', insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('task template is sitting')
})

app.listen(port, () =>{
    console.log(`task template is sitting on port ${port}`)
})