"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const express = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_flash_1 = __importDefault(require("express-flash"));
const express_session_1 = __importDefault(require("express-session"));
require('./config/passport')(passport_1.default);
const cors = require('cors');
const app = express();
// DB info
const username = 'selmetwa';
const cluster = 'cluster0.eauvk';
const dbname = 'myFirstDatabase';
const password = process.env.PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
// Connect to MongoDB
mongoose_1.default.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected successfully');
});
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use((0, express_flash_1.default)());
app.use((0, express_session_1.default)({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// Passport Middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
// Authentication routes
app.use('/auth', require('./routes/auth.ts'));
// Item routes
app.use('/items', require('./routes/item.ts'));
// Collection Routes
app.use('/collections', require('./routes/collections.ts'));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running'));
