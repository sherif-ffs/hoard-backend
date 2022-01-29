/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import Collection from '../models/collection';
import { addItemToCollection, removeItemFromCollection } from '../utils';
const objectId = require('mongodb').ObjectID;

const router = express.Router();

// create collection
router.post('/create-collection', async (req, res) => {
  const { collection } = req.body;
  try {
    const newCollection = await Collection.create(collection);
    res.send({ status: 'ok', data: newCollection });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch collections by userId
router.get('/collection', async (req, res) => {
  try {
    const id = req.query.id as string;
    const collections = await Collection.find({ userId: id });
    res.send({ status: 'ok', data: collections });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch collection by collectionID
router.get('/collection-by-collection-id', async (req, res) => {
  try {
    const id = req.query.id as string;
    const collection = await Collection.find({ _id: new objectId(id) });
    res.send({ status: 'ok', data: collection });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

// fetch all collections
router.post('/collections', async (req, res) => {
  const limit = Number(req.body.limit);
  const offset = Number(req.body.offset);
  const filterList = req.body.filterList;
  try {
    let collections;
    let collectionsCount;
    if (filterList && !!filterList.length) {
      collections = await Collection.find({ tags: { $in: filterList } })
        .skip(offset)
        .limit(limit);
      collectionsCount = await Collection.find({
        tags: { $in: filterList },
      }).count();
    } else {
      collections = await Collection.find().skip(offset).limit(limit);
      collectionsCount = await Collection.find().count();
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
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

// add item to collection
router.post('/add-item-to-collection', async (req, res) => {
  const id = req.body.id;
  const item = req.body.item;
  try {
    addItemToCollection([id], item);
    res.json({ status: 'ok', data: 'item added' });
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

// remove item from collections
router.post('/remove-item-from-collection', async (req, res) => {
  const collectionId = req.body.collectionId;
  const item = req.body.item;

  try {
    removeItemFromCollection(item, collectionId);
    res.json({ status: 'ok', data: 'item removed' });
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

// check if item is included in collection
router.get('/check-if-item-is-in-collection', async (req, res) => {
  const itemId = req.query.itemId as string;
  const collectionId = req.query.collectionId as string;

  try {
    const collection = await Collection.find({
      _id: new objectId(collectionId),
    });
    const items =
      collection &&
      collection[0] &&
      collection[0].items &&
      collection[0].items.map((item) => item._id);

    const itemIds = items && !!items.length && items.map((id) => id.toString());
    const includes = itemIds && itemIds.includes(itemId);
    res.json({ status: 'ok', data: includes });
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

// delete collection
router.post('/delete-collection', async (req, res) => {
  const id = req.body.id as string;
  try {
    await Collection.deleteOne({ _id: new objectId(id) });
    res.json({ status: 'ok', data: 'collection deleted successfully' });
  } catch (error: any) {
    res.json({ status: 'error', error: error.message });
    throw error;
  }
});

// fetch collections count
router.get('/count', async (req, res) => {
  try {
    const count = await Collection.count();
    res.send({ status: 'ok', data: count });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});

module.exports = router;
