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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectId = require('mongodb').ObjectID;
const JWT_SECRET = process.env.JWT_SECRET;
const router = express_1.default.Router();
router.post('/logout', (req, res) => {
    try {
        req.logout();
        req.session.destroy();
        const responseData = {
            authenticated: req.isAuthenticated(),
        };
        return res.send({ status: 'ok', data: responseData });
    }
    catch (error) {
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
        }
        else {
            return res.json({
                status: 'ok',
                data: {
                    user: null,
                    authenticated: false,
                },
            });
        }
    }
    catch (error) {
        res.json({ status: 'error', error: error.message });
    }
});
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', function (err, user) {
        // Handle Error
        if (err)
            return res.json({ status: 'error', error: 'something went wrong' });
        if (!user)
            return res.json({ status: 'error', error: 'user not found' });
        req.login(user, function (err) {
            if (err)
                return res.json({ status: 'error', error: 'something went wrong' });
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                email: user.email,
            }, JWT_SECRET);
            const responseData = {
                token: token,
                user: user,
                authenticated: req.isAuthenticated(),
            };
            return res.json({ status: 'ok', data: responseData });
        });
    })(req, res, next);
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: plainTextPassword, name } = req.body;
    const password = yield bcryptjs_1.default.hash(plainTextPassword, 10);
    try {
        const response = yield user_1.default.create({
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
    }
    catch (error) {
        if (error.code === 11000) {
            // duplicate key
            res.json({ status: 'error', error: 'email already in use' });
        }
        else {
            res.json({ status: 'error', error: error.message });
            throw error;
        }
    }
}));
//update socials
router.post('/socials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { github, twitter, portfolio, role, id } = req.body;
    try {
        const a = yield user_1.default.updateOne({ _id: new objectId(id) }, {
            $set: {
                github: github,
                twitter: twitter,
                portfolio: portfolio,
                role: role,
            },
        });
        res.json({ status: 'ok', data: 'success' });
    }
    catch (error) {
        res.json({ status: 'error', error: error.message });
        throw error;
    }
}));
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_1.default.find();
        if (!allUsers) {
            return res.json({ status: 'error', error: 'no users found' });
        }
        res.json({ status: 'ok', data: allUsers });
    }
    catch (error) {
        return res.json({ status: 'error', error: error });
    }
}));
// fetch user by id
router.get('/user-by-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const user = yield user_1.default.find({ _id: new objectId(id) });
        res.send({ status: 'ok', data: user });
    }
    catch (err) {
        res.send({ status: 'error', error: err });
    }
}));
module.exports = router;
