require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173',
      'https://job-task-managerapp.web.app',
    ],
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json());






  

  app.get('/',(req,res)=>{
    res.send('Cholteche');
  })

  app.listen(port,(req,res)=>{
    console.log(`app is running on ${port}`);
  })