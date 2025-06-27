const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./routes/user");

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")){
        return res.status(403).json({
            msg: "Unauthorized user"
        });
    }
    const token = header.split(" ")[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(403).json({});
    }

}

module.exports = { authMiddleware };