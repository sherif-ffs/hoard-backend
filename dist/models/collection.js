"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const collectionSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    tags: {
        type: [],
        required: false,
    },
    likes: {
        type: Number,
        required: true,
    },
    isPrivate: {
        type: Boolean,
        required: true,
    },
    items: {
        type: [],
        required: false,
    },
    datePublished: {
        type: Date,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Collection', collectionSchema);
