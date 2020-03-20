const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

dotenv.config();

exports.checkAuthUser = (req, res, next) => {
    var token = req.headers['authorization']; //token obtained from header
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' }); //no token in header
    jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
        if (err){
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); //auth failure
        }
        if(!decoded.uid){
            return res.status(403).send({ auth: false, message: 'Bad Request' });
        }
        User.findOne({ where: {uid:decoded.uid}}).then(function(User){
            if(User){
                req.User = User;
                next();
            }
            else{
                return res.status(403).send({ auth: false, message: 'Bad Request' });    
            }
        });
    });
}

exports.checkAuthAdmin = (req, res, next) => {
    var token = req.headers['authorization']; //token obtained from header
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' }); //no token in header
        jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
        if (err){
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); //auth failure
        }
        if(!decoded.uid){
            return res.status(403).send({ auth: false, message: 'Bad Request' });
        }
        User.findOne({ where: {uid:decoded.uid}}).then(function(User){
            if(User){
                if(User.isAdmin==1){
                req.User = User;
                next();
                }
                else
                    return res.status(200).send({auth:false,message:'Not Admin'});
            }
            else{
                return res.status(403).send({ auth: false, message: 'Bad Request' });    
            }
        });
    });
}