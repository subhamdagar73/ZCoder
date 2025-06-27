const express = require('express');
const { User } = require('../db');
const { authMiddleware } = require('../middleware');

const solveRouter = express.Router();

solveRouter.post('/', authMiddleware, async (req, res) => {
    const problem = req.body;
    try {
        const updatedUser = await User.updateOne(
            { _id: req.userId },
            { $push: { solvedProblems: problem.problemId } }
        );
        res.status(200).json({
            msg: "Problem solved"
        });
    } catch (error) {
        res.status(400).json({
            msg: "Error while solving problem"
        })
    }
});

solveRouter.delete('/:id', authMiddleware, async (req, res) => {
    const problemId = req.params.id;
    try {
        const updatedUser = await User.updateOne(
            { _id: req.userId },
            { $pull: { solvedProblems: problemId } }
        );
        res.status(200).json({
            msg: "Problem unsolved"
        });
    } catch (error) {
        res.status(400).json({
            msg: "Error while unsolving problem"
        })
    }
});

module.exports = { solveRouter };