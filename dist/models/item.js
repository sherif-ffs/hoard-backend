"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    author: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
        unique: false,
    },
    collections: {
        type: [],
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    tags: {
        type: [],
        required: false,
    },
    likes: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    imageID: {
        type: String,
        required: false,
    },
    isPrivate: {
        type: Boolean,
        required: true,
    },
    datePublished: {
        type: Date,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Item', itemSchema);
