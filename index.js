const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!! server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ne4h.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const userCollection = client.db("nabojagoron").collection("users");
    const todoCollection = client.db("TodoApp").collection("Todos");


    // =====get method====
    app.get('/todo/:email', async (req, res) => {
      const email = req.params.email;
      const todos = await todoCollection.find({email: email}).toArray();
      res.send(todos);
    })


    // ===== Post method ======

    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    })

    // ===== Delete method ======

    app.delete('/todo/:id',  async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    })

    // ====== put method ======

    app.put('/todo/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectID(id)}
        const updateDoc = {
          $set: {status: 'complete'}
        };
        const result = await todoCollection.updateOne(filter, updateDoc);
        res.send(result)
    })

    app.put('/todoUpdate/:id', async (req, res) => {
        const id = req.params.id;
        const task = req.body.task;
        const filter = {_id: ObjectID(id)}
        const updateDoc = {
          $set: {task: task}
        };
        const result = await todoCollection.updateOne(filter, updateDoc);
        res.send(result)
    })


  }finally{

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})