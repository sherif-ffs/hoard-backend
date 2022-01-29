/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/user';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectId = require('mongodb').ObjectID;

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post('/logout', (req: any, res) => {
  try {
    req.logout();
    req.session.destroy();
    const responseData = {
      authenticated: req.isAuthenticated(),
    };
    return res.send({ status: 'ok', data: responseData });
  } catch (error: any) {
    res.json({ status: 'error', error: error.message });
  }
});

router.post('/checkAuth', (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.json({
        status: 'ok',
        data: {
          user: req.user,
          authenticated: true,
        },
      });
    } else {
      return res.json({
        status: 'ok',
        data: {
          user: null,
          authenticated: false,
        },
      });
    }
  } catch (error: any) {
    res.json({ status: 'error', error: error.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function (err, user) {
    // Handle Error
    if (err)
      return res.json({ status: 'error', error: 'something went wrong' });

    if (!user) return res.json({ status: 'error', error: 'user not found' });

    req.login(user, function (err) {
      if (err)
        return res.json({ status: 'error', error: 'something went wrong' });

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        JWT_SECRET as string
      );

      const responseData = {
        token: token,
        user: user,
        authenticated: req.isAuthenticated(),
      };
      return res.json({ status: 'ok', data: responseData });
    });
  })(req, res, next);
});

router.post('/register', async (req, res) => {
  const { email, password: plainTextPassword, name } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      email: email,
      password: password,
      name: name,
      role: '',
      twitter: '',
      github: '',
      portfolio: '',
      collections: [],
    });
    if (response) {
      res.json({ status: 'ok', data: 'user registered successfully' });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      // duplicate key
      res.json({ status: 'error', error: 'email already in use' });
    } else {
      res.json({ status: 'error', error: error.message });
      throw error;
    }
  }
});

//update socials
router.post('/socials', async (req, res) => {
  const { github, twitter, portfolio, role, id } = req.body;

  try {
    const a = await User.updateOne(
      { _id: new objectId(id) },
      {
        $set: {
          github: github,
          twitter: twitter,
          portfolio: portfolio,
          role: role,
        },
      }
    );
    res.json({ status: 'ok', data: 'success' });
  } catch (error: any) {
    res.json({ status: 'error', error: error.message });
    throw error;
  }
});

router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      return res.json({ status: 'error', error: 'no users found' });
    }
    res.json({ status: 'ok', data: allUsers });
  } catch (error) {
    return res.json({ status: 'error', error: error });
  }
});

// fetch user by id
router.get('/user-by-id', async (req, res) => {
  try {
    const id = req.query.id as string;
    const user = await User.find({ _id: new objectId(id) });
    res.send({ status: 'ok', data: user });
  } catch (err) {
    res.send({ status: 'error', error: err });
  }
});
module.exports = router;
