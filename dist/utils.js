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
exports.removeItemFromAllCollections = exports.removeItemFromCollection = exports.addItemToCollection = exports.scrapeImageFromUrl = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs_1 = __importDefault(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const collection_1 = __importDefault(require("./models/collection"));
const objectId = require('mongodb').ObjectID;
const scrapeImageFromUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    // if screenshots directory is not exist then create one
    if (!fs_1.default.existsSync('./screenshots')) {
        fs_1.default.mkdirSync('./screenshots');
    }
    // open the browser and prepare a page
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    // set the size of the viewport, so our screenshot will have the desired size
    yield page.setViewport({
        width: 1280,
        height: 800,
    });
    const ImageID = new Date().getTime().toString(36);
    const loc = `./screenshots/${ImageID}.png`;
    yield page.goto(url, { waitUntil: 'networkidle0' });
    yield page.screenshot({
        path: loc,
    });
    // get page title
    const pageTitle = yield page.title();
    // close the browser
    yield browser.close();
    return {
        ImageID: ImageID,
        pageTitle: pageTitle,
    };
    // return ImageID;
});
exports.scrapeImageFromUrl = scrapeImageFromUrl;
// Add Item To Collection
const addItemToCollection = (collectionIds, item) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('item: ', item);
    collectionIds.forEach((collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        const add = yield collection_1.default.updateOne({
            _id: new objectId(collectionId),
        }, { $push: { items: item } });
        console.log('add; ', add);
    }));
});
exports.addItemToCollection = addItemToCollection;
// remove item from single collection
const removeItemFromCollection = (item, collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = item;
    const remove = yield collection_1.default.updateOne({
        _id: new objectId(collectionId),
    }, { $pull: { items: item } });
    console.log('remove: ', remove);
});
exports.removeItemFromCollection = removeItemFromCollection;
// remove item for all collections
const removeItemFromAllCollections = (itemToDelete, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { collections } = itemToDelete[0];
    if (collections && !!collections.length) {
        const collectionIds = collections.map((c) => c.id.toString());
        collectionIds.forEach((collectionId) => __awaiter(void 0, void 0, void 0, function* () {
            yield collection_1.default.updateOne({
                _id: new objectId(collectionId),
            }, { $pull: { items: { _id: new objectId(id) } } });
        }));
    }
});
exports.removeItemFromAllCollections = removeItemFromAllCollections;
