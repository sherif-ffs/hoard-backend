/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express = require('express');
import mongoose, { ConnectOptions } from 'mongoose';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
require('./config/passport')(passport);

const cors = require('cors');
const app = express();

// DB info
const username = 'selmetwa';
const cluster = 'cluster0.eauvk';
const dbname = 'myFirstDatabase';
const password = process.env.PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(flash());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes

// Authentication routes
app.use('/auth', require('./routes/auth.ts'));

// Item routes
app.use('/items', require('./routes/item.ts'));

// Collection Routes
app.use('/collections', require('./routes/collections.ts'));

const port = process.env.PORT || 5000
app.listen(port, () => console.log('Server running'));
