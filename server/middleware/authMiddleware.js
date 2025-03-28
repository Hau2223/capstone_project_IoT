const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const checkUser = (req, res, next)=>{
    console.log(req);
    
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, 'Q$r2K6W8n!jCW%Zk', async (err, decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { checkUser };

