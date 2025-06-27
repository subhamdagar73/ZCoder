const express = require('express');
const { User } = require('../db');
const { authMiddleware } = require('../middleware');

const bookmarkRouter = express.Router();

bookmarkRouter.post('/', authMiddleware, async (req, res) => {
    const problem = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userId },
            { $push: { bookmarkedProblems: problem.problemId } }
        );
        res.status(200).json({
            msg: "Problem bookmarked"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Error while bookmarking problem"
        })
    }
});

bookmarkRouter.delete('/:id', authMiddleware, async (req, res) => {
    const problemId = req.params.id;
    try {
        const updatedUser = await User.updateOne(
            { _id: req.userId },
            { $pull: { bookmarkedProblems: problemId } }
        );
        res.status(200).json({
            msg: "Problem unbookmarked"
        });
    } catch (error) {
        res.status(400).json({
            msg: "Error while unbookmarking problem"
        })
    }
});

module.exports = { bookmarkRouter };