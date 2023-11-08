const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




// middleware

app.use(cors());
app.use(express.json());






// mongodb work start


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ouqbod.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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

// data pathanor work start
const jobCollection = client.db('jobDB').collection('job');
const bitCollection = client.db('jobDB').collection('bit');
 

// step--2

app.get('/online', async (req, res) => {
  try {
    const query = {};
    if (req.query.email) {
      query.email = req.query.email;
    }
    const result = await jobCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
  
// ..............

app.get('/online/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await jobCollection.findOne(query);
  res.send(result);
})
// ...............................



// step--1
app.post('/online', async(req, res) =>{
    const newAddJob = req.body;
    console.log(newAddJob);
    const result = await jobCollection.insertOne(newAddJob);
    res.send(result);

})

// end server post


// start post work bit now button

// step-1
app.post('/bit', async(req, res) =>{
    const newAddJob = req.body;
    console.log(newAddJob);
    const result = await bitCollection.insertOne(newAddJob);
    res.send(result);

})


// step-2
app.get('/bit', async(req, res) => {
    const cursor = bitCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

// end post work bit




// delete operation start
app.delete('/online/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await jobCollection.deleteOne(query);
  res.send(result);
})

// delete operation end




// update section start

app.get('/online/:id', async(req, res) => {
const id = req.params.id;
const query = {_id: new ObjectId(id)}
const result = await jobCollection.findOne(query);
res.send(result);

})

// jobTitle, deadline, maximumPrice, description, minimumPrice, email, category 

app.put('/online/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const Update = req.body;
  const job = {
    $set: {
      email: Update.email,
      jobTitle: Update.jobTitle,
       deadline: Update.deadline, 
       category: Update.category, 
        minimumPrice: Update. minimumPrice, 
       maximumPrice: Update.maximumPrice, 
       description: Update.description,
        
        
    }
  }
  const result = await jobCollection.updateOne(filter, job, options);
  res.send(result);
})

// update section end

// request update work start


app.patch('/bit/:id', async(request, response) => {
  const id = request.params.id
  const query = { _id: new ObjectId(id) }

  const updateStatue = {
    $set: {
     status: request.body.status,
    },
  };
  const result = await bitCollection.updateOne(query, updateStatue);
  response.send(result);
});
app.patch('/bit/:id', async(request, response) => {
  const id = request.params.id
  const query = { _id: new ObjectId(id) }

  const updateStatue = {
    $set: {
     status: request.body.status,
    },
  };
  const result = await bitCollection.updateOne(query, updateStatue);
  response.send(result);
});


// app.get('/BidRequest', async (req, res) => {
//   try {
//     const query = {};
//     if (req.query.Byeremail) {
//       query.Byeremail = req.query.Byeremail;
//     }
//     const result = await mybids.find(query).toArray();
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb work end




app.get('/', (req, res) => {
    res.send('Online market server is running ok ')
})

app.listen(port, () => {
    console.log(`Online server is running on port: ${port}`);
})