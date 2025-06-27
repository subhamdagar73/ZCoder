const express = require('express');
const axios = require('axios');
const problemRouter = express.Router();
const {Problem} = require('../db');
// fetching problems from codeforces api
problemRouter.get('/question', async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/api/problemset.problems');
        res.json(response.data);
    } catch (error) {
        res.send(error);
    }
});
// posting 5 problems of each rating to the database coming from the above get request    
problemRouter.post('/coding', async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/api/problemset.problems');
        const problems = response.data.result.problems;
        // Create a map to store problems by rating
        const problemsByRating = {};
        problems.forEach((problem) => {
            if (problem.rating) {
                if (!problemsByRating[problem.rating]) {
                    problemsByRating[problem.rating] = [];
                }
                problemsByRating[problem.rating].push(problem);
            }
        });
        // extract 5 problems of each rating
        const problemsToInsert = [];
        for (let rating in problemsByRating) {
            problemsToInsert.push(...problemsByRating[rating].slice(0, 5));
        }
        // prepare the problems to be inserted
        const problemsToInsertFormatted = problemsToInsert.map((problem) => {
            return {
                name: problem.name,
                contestId: problem.contestId,
                index: problem.index,
                rating: problem.rating,
                tags: problem.tags
            };
        });
        // insert the problems into the database
        await Problem.insertMany(problemsToInsertFormatted);
        res.json({message: "Problems inserted successfully", problems: problemsToInsertFormatted});
    } catch (error) {
        res.send(error);
    }
});

problemRouter.get('/bulk', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.send(error);
    }
});


module.exports = { problemRouter};