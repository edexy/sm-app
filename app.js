const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config()
const AuthRoutes = require('./route');

const db = require('./db');




const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json({ limit: '10mb', extended: true }));



app.use('/api/auth', AuthRoutes);
app.use('/api/courses', AuthRoutes);

//default route
app.get('*', async(req, res) => {

    // const snapshot = await db.collection('users').get();
    // console.log(snapshot)
    //     // snapshot.forEach((doc) => {
    //     //     console.log(doc.id, '=>', doc.data());
    //     // });



    res.status(200).send({
        message: 'Welcome to the beginning of nothingness. SM-API',
    })
});

module.exports = app;