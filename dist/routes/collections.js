"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const express_1 = __importDefault(require("express"));
const collection_1 = __importDefault(require("../models/collection"));
const utils_1 = require("../utils");
const objectId = require('mongodb').ObjectID;
const router = express_1.default.Router();
// create collection
router.post('/create-collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collection } = req.body;
    try {
        const newCollection = yield collection_1.default.create(collection);
        res.send({ status: 'ok', data: newCollection });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch collections by userId
router.get('/collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const collections = yield collection_1.default.find({ userId: id });
        res.send({ status: 'ok', data: collections });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch collection by collectionID
router.get('/collection-by-collection-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const collection = yield collection_1.default.find({ _id: new objectId(id) });
        res.send({ status: 'ok', data: collection });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch all collections
router.post('/collections', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.body.limit);
    const offset = Number(req.body.offset);
    const filterList = req.body.filterList;
    try {
        let collections;
        let collectionsCount;
        if (filterList && !!filterList.length) {
            collections = yield collection_1.default.find({ tags: { $in: filterList } })
                .skip(offset)
                .limit(limit);
            collectionsCount = yield collection_1.default.find({
                tags: { $in: filterList },
            }).count();
        }
        else {
            collections = yield collection_1.default.find().skip(offset).limit(limit);
            collectionsCount = yield collection_1.default.find().count();
        }
        if (!collections) {
            return res.json({ status: 'error', error: 'no collections found' });
        }
        res.json({
            status: 'ok',
            data: {
                collections,
                collectionsCount,
            },
        });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
// add item to collection
router.post('/add-item-to-collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const item = req.body.item;
    try {
        (0, utils_1.addItemToCollection)([id], item);
        res.json({ status: 'ok', data: 'item added' });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
// remove item from collections
router.post('/remove-item-from-collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.body.collectionId;
    const item = req.body.item;
    try {
        (0, utils_1.removeItemFromCollection)(item, collectionId);
        res.json({ status: 'ok', data: 'item removed' });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
// check if item is included in collection
router.get('/check-if-item-is-in-collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.query.itemId;
    const collectionId = req.query.collectionId;
    try {
        const collection = yield collection_1.default.find({
            _id: new objectId(collectionId),
        });
        const items = collection &&
            collection[0] &&
            collection[0].items &&
            collection[0].items.map((item) => item._id);
        const itemIds = items && !!items.length && items.map((id) => id.toString());
        const includes = itemIds && itemIds.includes(itemId);
        res.json({ status: 'ok', data: includes });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
// delete collection
router.post('/delete-collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        yield collection_1.default.deleteOne({ _id: new objectId(id) });
        res.json({ status: 'ok', data: 'collection deleted successfully' });
    }
    catch (error) {
        res.json({ status: 'error', error: error.message });
        throw error;
    }
}));
// fetch collections count
router.get('/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield collection_1.default.count();
        res.send({ status: 'ok', data: count });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
module.exports = router;
