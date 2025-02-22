require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors({
    origin: ['http://localhost:5173',
        'https://job-task-managerapp.web.app',
    ],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

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
        app.post('/user',async (req, res) => {
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
        app.post('/task', async (req,res)=>{
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
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