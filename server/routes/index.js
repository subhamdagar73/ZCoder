const express = require('express');
const {userRouter} = require('./user');
const {problemRouter} = require('./problems');
const { solveRouter } = require('./solve');
const { bookmarkRouter } = require('./bookmark');

const router = express.Router();
router.use("/user", userRouter);
router.use("/problem", problemRouter);
router.use("/solve", solveRouter);
router.use("/bookmark", bookmarkRouter);
module.exports = {router};