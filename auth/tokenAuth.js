const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken =  (token) => {
   
    try {
        const decoded =  jwt.verify(token, SECRET_KEY);
        return {
            success: true,
            message: "Token verified successfully",
            decoded
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Token verification failed: " + error.message
        };
    }
}

const verifyTokenMiddleware = (req, res, next) => {
   
    const token = req?.headers?.authorization;

    if(!token){
        return res.status(401).send({message: "please login first to archeive this functionality"})
    }

    const verificationResult = verifyToken(token);

    if (verificationResult.success) {
        req.user = verificationResult.decoded; // Attach decoded token to the request object
        console.log("user is authenticated")
        next();
    } else {
        res.status(401).json({ status: 401, message: verificationResult.message });
    }
}

module.exports = {verifyTokenMiddleware}