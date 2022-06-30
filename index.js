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



// const uri = "mongodb+srv://users:<password>@cluster0.1ne4h.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



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


    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({email: email});
      const isAdmin = user.role === "admin"
      res.send({admin: isAdmin});
    })


    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const product = await productCollection.findOne(query);
      res.send(product);
    })

    app.get('/payProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const product = await orderCollection.findOne(query);
      res.send(product);
    })

    // ===== Post method ======

    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    })

    app.post('/applyUser/:email', async (req, res) => {
      const email = req.params.email;
      const applyUser = req.body;
      const result = await applyUserCollection.insertOne(applyUser);
      res.send(result);
    })

    // payment getway method api
    app.post('/create-payment-intent', async (req, res) => {
      const service = req.body;
      const price = service.price;
      const amount = price*100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types:['card']
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    })

    // ===== patch method ======

    app.patch('/order/:id', async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = {_id: ObjectID(id)};
      const updateDoc = {
        $set: {
          paid: true,
          status: 'pending',
          transactionId: payment.transactionId,
        }
      }
      const result = await paymentCollection.insertOne(payment);
      const updateOrder = await orderCollection.updateOne(filter, updateDoc);
      res.send(updateDoc, result, updateOrder); 
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


  }finally{

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})