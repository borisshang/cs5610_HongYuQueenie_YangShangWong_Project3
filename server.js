const express = require('express');

const postApi = require('./server/post.server');
const cors = require('cors')

//const path = require('path')
const cookieParser = require('cookie-parser')

/* User Server Stuff */
const userApi = require('./server/user.server');

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* MongoDB Stuff */
const mongoose = require('mongoose');
const MONGO_CONNECTION_STRING = 'mongodb+srv://hyq:pineapple1234@nuwebdev.nqnv9f0.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use('/api/post', postApi);
app.use('/api/user', userApi);
app.listen(process.env.PORT || 3500, function() {
    console.log("Starting server now...")
})