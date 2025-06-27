const express = require('express');
const cors = require('cors');
require('./db');

const app = express();
app.use(cors());
app.use(express.json());
const {router} = require('./routes/index');

app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
