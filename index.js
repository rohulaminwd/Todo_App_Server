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

    const todoCollection = client.db("TodoApp").collection("Todos");
    const scheduleCollection = client.db("zoomla").collection("scheduleList");
    const zoomlaFeed = client.db("zoomla").collection("FeedPost");
    const zoomlaStory = client.db("zoomla").collection("Story");
    const zoomlaUser = client.db("zoomla").collection("users");


    // =====get method====
    app.get('/todo/:email', async (req, res) => {
      const email = req.params.email;
      const todos = await todoCollection.find({email: email}).toArray();
      res.send(todos);
    })

    app.get('/events', async (req, res) => {
      const events = await scheduleCollection.find().toArray();
      res.send(events.reverse());
    })

    app.get('/feedPost', async (req, res) => {
      const feeds = await zoomlaFeed.find().toArray();
      res.send(feeds.reverse());
    })

    app.get('/story', async (req, res) => {
      const story = await zoomlaStory.find().toArray();
      res.send(story.reverse());
    })

    app.get('/user', async (req, res) => {
      const user = await zoomlaUser.find().toArray();
      res.send(user.reverse());
    })


    // ===== Post method ======

    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    })

    app.post('/events', async (req, res) => {
      const events = req.body;
      const result = await scheduleCollection.insertOne(events);
      const data = await scheduleCollection.find().toArray();
      res.send(data.reverse());
    })

    app.post('/feedPost', async (req, res) => {
      const feedPost = req.body;
      const result = await zoomlaFeed.insertOne(feedPost);
      const data = await zoomlaFeed.find().toArray();
      res.send(data.reverse());
    })

    app.post('/story', async (req, res) => {
      const feedPost = req.body;
      const result = await zoomlaStory.insertOne(feedPost);
      const data = await zoomlaStory.find().toArray();
      res.send(data.reverse());
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await zoomlaUser.insertOne(user);
      const data = await zoomlaUser.find().toArray();
      res.send(data.reverse());
    })

    // ===== Delete method ======

    app.delete('/todo/:id',  async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    })

    app.delete('/events/:id',  async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await scheduleCollection.deleteOne(query);
      res.send(result);
    })

    app.delete('/feedPost/:id',  async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await zoomlaFeed.deleteOne(query);
      res.send(result);
    })

    // ====== put method ======

    app.put('/todo/:id', async (req, res) => {
        const id = req.params.id;
        const date = req.body.dates;
        const filter = {_id: ObjectID(id)}
        const updateDoc = {
          $set: {
            status: 'complete',
            CompleteDate: date,
          }
        };
        const result = await todoCollection.updateOne(filter, updateDoc);
        res.send(result)
    })

    app.put('/todoUpdate/:id', async (req, res) => {
        const id = req.params.id;
        const task = req.body.task;
        const title = req.body.title;
        const filter = {_id: ObjectID(id)}
        const updateDoc = {
          $set: {
            task: task,
            title: title,
          }
        };
        const result = await todoCollection.updateOne(filter, updateDoc);
        res.send(result)
    })

    app.put('/UpdateUser/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: ObjectID(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          img: data.img,
          bio: data.bio
        }
      };
      const result = await zoomlaUser.updateOne(filter, updateDoc, options);
      const users = await zoomlaUser.find().toArray();
      res.send({result, users})
  })


  }finally{

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})