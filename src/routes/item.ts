/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';

import Item from '../models/item';

const router = express.Router();
const fs = require('fs');
const utils = require('util');
const objectId = require('mongodb').ObjectID;
const { uploadFile, getFileStream } = require('../s3');

const unlinkFile = utils.promisify(fs.unlink);

import {
  scrapeImageFromUrl,
  addItemToCollection,
  removeItemFromAllCollections,
} from '../utils';

router.get('/images/:id', (req, res: any) => {
  const ImageID = req.params.id;
  const readStream = getFileStream(ImageID);

  readStream.pipe(res);
});

// Create Item
router.post('/create-item', async (req, res) => {
  const { item } = req.body;
  let realItem;
  scrapeImageFromUrl(item.url).then(async (response) => {
    const { ImageID, pageTitle } = response;
    await uploadFile(`./screenshots/${ImageID}.png`);
    await unlinkFile(`./screenshots/${ImageID}.png`);
    item.name = pageTitle;
    realItem = {
      ...item,
      imageID: ImageID,
    };
    try {
      const newItem = await Item.create(realItem);

      const { collections } = newItem;
      if (collections && !!collections.length) {
        const collectionIds = collections.map((c) => c.id);
        addItemToCollection(collectionIds, newItem);
      }
      res.json({ status: 'ok', data: newItem });
    } catch (error: any) {
      res.json({ status: 'error', error: error.message });
      throw error;
    }
  });
});

// Delete Item
router.post('/delete-item', async (req, res) => {
  const id = req.body.id;
  try {
    const itemToDelete = await Item.find({ _id: id });
    removeItemFromAllCollections(itemToDelete, id);
    await Item.deleteOne({ _id: new objectId(id) });
    res.json({ status: 'ok', data: 'item deleted successfully' });
  } catch (error: any) {
    res.json({ status: 'error', error: error.message });
    throw error;
  }
});

// Fetch all Items
router.post('/items', async (req, res) => {
  const limit = Number(req.body.limit);
  const offset = Number(req.body.offset);
  const filterList = req.body.filterList;
  try {
    let items;
    let itemCount;
    if (filterList && !!filterList.length) {
      items = await Item.find({ tags: { $in: filterList } })
        .skip(offset)
        .limit(limit);
      itemCount = await Item.find({ tags: { $in: filterList } }).count();
    } else {
      items = await Item.find().skip(offset).limit(limit);
      itemCount = await Item.count();
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
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

//fetch item by itemId
router.get('/item', async (req, res) => {
  try {
    const id = req.query.id as string;
    const collection = await Item.find({ _id: new objectId(id) });
    res.send({ status: 'ok', data: collection });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch items by userId
router.get('/more-items-by', async (req, res) => {
  try {
    const id = req.query.id as string;
    const items = await Item.find({ userId: id }).limit(4);
    res.send({ status: 'ok', data: items });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch all of a users' items
router.get('/items-by', async (req, res) => {
  try {
    const id = req.query.id as string;
    const items = await Item.find({ userId: id });
    res.send({ status: 'ok', data: items });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch items by tag
router.post('/items-by-tag', async (req, res) => {
  try {
    const tags = req.body.tags as Array<string>;
    const items = await Item.find({ tags: { $in: tags } }).limit(6);
    res.send({ status: 'ok', data: items });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch items count
router.get('/count', async (req, res) => {
  try {
    const count = await Item.count();
    res.send({ status: 'ok', data: count });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

module.exports = router;
