const jwt = require('jsonwebtoken');

const jwtVerifier = function (req, res, next) {

    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.tokenSecret, (error, decoded) => {
            if (error) {
                return res.status(401).send({ token: error });
            } else {
                next();
            }
        });
    
    }
    catch (err) {
        return res.status(401).send({ message: "Unauthorised" });
    }
}

module.exports = jwtVerifier;