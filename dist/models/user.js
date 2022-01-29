"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    portfolio: {
        type: String,
        required: false,
    },
    github: {
        type: String,
        required: false,
    },
    collections: {
        type: [],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const user = (0, mongoose_1.model)('User', userSchema);
exports.default = user;
