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
const item_1 = __importDefault(require("../models/item"));
const router = express_1.default.Router();
const fs = require('fs');
const utils = require('util');
const objectId = require('mongodb').ObjectID;
const { uploadFile, getFileStream } = require('../s3');
const unlinkFile = utils.promisify(fs.unlink);
const utils_1 = require("../utils");
router.get('/images/:id', (req, res) => {
    const ImageID = req.params.id;
    const readStream = getFileStream(ImageID);
    readStream.pipe(res);
});
// Create Item
router.post('/create-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { item } = req.body;
    let realItem;
    (0, utils_1.scrapeImageFromUrl)(item.url).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const { ImageID, pageTitle } = response;
        yield uploadFile(`./screenshots/${ImageID}.png`);
        yield unlinkFile(`./screenshots/${ImageID}.png`);
        item.name = pageTitle;
        realItem = Object.assign(Object.assign({}, item), { imageID: ImageID });
        try {
            const newItem = yield item_1.default.create(realItem);
            const { collections } = newItem;
            if (collections && !!collections.length) {
                const collectionIds = collections.map((c) => c.id);
                (0, utils_1.addItemToCollection)(collectionIds, newItem);
            }
            res.json({ status: 'ok', data: newItem });
        }
        catch (error) {
            res.json({ status: 'error', error: error.message });
            throw error;
        }
    }));
}));
// Delete Item
router.post('/delete-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        const itemToDelete = yield item_1.default.find({ _id: id });
        (0, utils_1.removeItemFromAllCollections)(itemToDelete, id);
        yield item_1.default.deleteOne({ _id: new objectId(id) });
        res.json({ status: 'ok', data: 'item deleted successfully' });
    }
    catch (error) {
        res.json({ status: 'error', error: error.message });
        throw error;
    }
}));
// Fetch all Items
router.post('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.body.limit);
    const offset = Number(req.body.offset);
    const filterList = req.body.filterList;
    try {
        let items;
        let itemCount;
        if (filterList && !!filterList.length) {
            items = yield item_1.default.find({ tags: { $in: filterList } })
                .skip(offset)
                .limit(limit);
            itemCount = yield item_1.default.find({ tags: { $in: filterList } }).count();
        }
        else {
            items = yield item_1.default.find().skip(offset).limit(limit);
            itemCount = yield item_1.default.count();
        }
        if (!items) {
            return res.json({ status: 'error', error: 'no items found' });
        }
        res.json({
            status: 'ok',
            data: {
                items,
                itemCount,
            },
        });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
//fetch item by itemId
router.get('/item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const collection = yield item_1.default.find({ _id: new objectId(id) });
        res.send({ status: 'ok', data: collection });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch items by userId
router.get('/more-items-by', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const items = yield item_1.default.find({ userId: id }).limit(4);
        res.send({ status: 'ok', data: items });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch all of a users' items
router.get('/items-by', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const items = yield item_1.default.find({ userId: id });
        res.send({ status: 'ok', data: items });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch items by tag
router.post('/items-by-tag', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = req.body.tags;
        const items = yield item_1.default.find({ tags: { $in: tags } }).limit(6);
        res.send({ status: 'ok', data: items });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
// fetch items count
router.get('/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield item_1.default.count();
        res.send({ status: 'ok', data: count });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
module.exports = router;
