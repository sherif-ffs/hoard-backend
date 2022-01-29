"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const user_1 = __importDefault(require("../models/user"));
module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        user_1.default.findOne({
            email: email,
        }).then((user) => {
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });
            }
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        user_1.default.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
