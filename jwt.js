const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not

        const authorization = req.headers.authorization
        if(!authorization) return res.status(401).json({error: 'token not found'});
    
    
    // Extract the jwt token from the reqiest headers
    const token = req.headers.authorization.split(' ')[1];
    console.log("token",req.headers.authorization);
    if(!token) return res.status(401).json({error: 'unauthorized'});

    try{
        // Verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("bnv ",decoded);
        // attach user infomation to the request object
        req.user = decoded;
       
        next();

    }catch(err){
        console.log(err);
        return res.status(401).json({error: 'internal server error'});
    }
}

// function to generate jwt token

const generationToken = (userData) => {
    // generate a new jwt toiken using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 300000} );
}

module.exports = {jwtAuthMiddleware, generationToken};