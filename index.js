require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors({
    origin: ['http://localhost:5173',
        'https://job-task-managerapp.web.app',
    ],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
});

//   xTuGGhquJY0jLiBJ
// Galib

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bidfx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db('TaskDB');
        const userCollection = database.collection('User');
        const taskCollection = database.collection('Tasks');

        // create user api
        app.post('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
                return res.status(200).json({
                    message: 'Login successful',
                });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // create task
        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        // get task
        app.get('/task', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        // get task by id 
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        // delete task 
        app.delete('/task', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // update Task 
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateTask = req.body;
            const updated = {
                $set: {
                    title: updateTask.title,
                    description: updateTask.description,
                    status: updateTask.status,
                    time: updateTask.time
                }
            }
            const options = { upsert: true }
            const result = await taskCollection.updateOne(query,updated,options);
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Cholteche');
})

app.listen(port, (req, res) => {
    console.log(`app is running on ${port}`);
})