const express = require('express');
const cors = require('cors');
require('./db');

const app = express();
app.use(cors());
app.use(express.json());
const {router} = require('./routes/index');

app.use("/api/v1", router);

app.listen(3000,()=>{
    console.log( "Server is running on http://localhost:3000");
});