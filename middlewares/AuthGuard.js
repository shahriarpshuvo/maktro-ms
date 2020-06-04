// const jwt = require('jsonwebtoken');

// const AuthHandler = (req, res, next) => {
//     const token = req.header('auth-token');
//     if (!token) return res.status(401).redirect('/');
//     try {
//         const verified = jwt.verify(token, process.env.JWT_TOKEN);
//         req.user = verified;
//         next();
//     } catch (e) {
//         return res.status(400).send('Invalid Token');
//     }
// };

// module.exports = AuthHandler;

