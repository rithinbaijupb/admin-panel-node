const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');


const app = express();

//connect mongoose
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
})();

//url parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//view and public 
app.set('view engine','ejs')
app.use(express.static('public'));

//session management
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
}))

//routes middleware
app.use(authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`server started in port ${port}`))