const jwt = require('jsonwebtoken');

const AuthHandler = (req, res, next) => {
    const token =  req.header('auth-token');
    if(!token) return res.status(401).send("Access Denied");
    try{
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = verified;
        next();
    } catch(e){
        res.status(400).send("Invalid Token");
    }
}

module.exports = AuthHandler;