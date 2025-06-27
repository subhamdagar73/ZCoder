const express = require('express');
const zod = require('zod');
const axios = require('axios');
const { User } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "mysecretpassword";

const userRouter = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    email: zod.string().email({"message": "Invalid email"}),
    codeforcesHandle: zod.string(),
    githubHandle: zod.string().optional(),
    linkedinHandle: zod.string().optional(),
});

const signinSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
});

userRouter.post('/signup', async (req, res) => {
    const parsedUser = req.body;
    const verifiedUser = signupSchema.safeParse(parsedUser);
    if(!verifiedUser.success){
        res.status(411).json({
            msg: "Something is wrong with your inputs"
        });
        return;
    }

    try{
        const response = await axios.get("https://codeforces.com/api/user.info?handles="+parsedUser.codeforcesHandle);
    }
    catch{
        res.status(400).json({
            msg:"Your codeforces handle is invalid"
        })
        return;
    }

    const criteria = {
        $or: [
            {
                email: parsedUser.email
            },
            {
                codeforcesHandle: parsedUser.codeforcesHandle
            },
            {
                username: parsedUser.username
            }
        ],
    };

    if(parsedUser.githubHandle){
        criteria.$or.push({
            githubHandle: parsedUser.githubHandle
        });
    }
    if(parsedUser.linkedinHandle){
        criteria.$or.push({
            linkedinHandle: parsedUser.linkedinHandle
        });
    }
    
    const searchedUser = await User.findOne(criteria);

    if(searchedUser){

        let matchedField = "";
        if(searchedUser.email === parsedUser.email){
            matchedField = "email ";
        }
        if(searchedUser.codeforcesHandle === parsedUser.codeforcesHandle){
            matchedField += "codeforcesHandle ";
        }
        if(searchedUser.username === parsedUser.username){
            matchedField += "username ";
        }
        if((parsedUser.githubHandle) && (searchedUser.githubHandle === parsedUser.githubHandle)){
            matchedField += "githubHandle ";
        }
        if((parsedUser.linkedinHandle) && (searchedUser.linkedinHandle === parsedUser.linkedinHandle)){
            matchedField += "linkedinHandle ";
        }

        res.status(400).json({
            msg: "User already exists with "+matchedField
        });
        return;
    }



    const user = await User.create(parsedUser);

    const token = jwt.sign({userId: user._id}, JWT_SECRET);
        res.status(200).json({
            msg: "User created successfully",
            token
        });
})

userRouter.post('/signin', async (req, res) => {
    const parsedUser = req.body;
    const verifiedUser = signinSchema.safeParse(parsedUser);
    if(!verifiedUser.success){
        res.status(411).json({
            msg: "Something is wrong with your inputs"
        });
        return;
    }
    const user = await User.findOne({
        email: parsedUser.email,
        password: parsedUser.password
    });

    if(!user){
        res.status(400).json({
            msg: "Invalid credentials"
        });
        return;
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET);
    res.status(200).json({
        msg: "User signed in successfully",
        token
    });
})

userRouter.get('/details', async (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({
        _id: decoded.userId
        });
        res.status(200).json({
            user
        });
    }
    catch{
        res.status(400).json({
            msg: "Invalid token"
        });
    }
})

module.exports = { userRouter, JWT_SECRET };