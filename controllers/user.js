const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const shortid = require('shortid');
const Products = require('../models').productlist;
const User = require('../models').User;
const Biddings = require('../models').biddings;

const Mailer = require('../controllers/utility');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

exports.register = (req, res, next) => {
    usercount = 0;
    User.count().then(function (result) {
        usercount = result;
        User.findOne({ where: { email: req.body.email } }).then(function (oldUser) {
            if (!oldUser) {
                isadm = 0;
                if (usercount == 0) {
                    isadm = 1;
                }
                new_salt = uuidv1();
                new_hashed_pwd = crypto.createHash('sha1', new_salt).update(req.body.pwd).digest('hex');
                User.create({
                    uid: 0,
                    email: req.body.email,
                    name: req.body.name,
                    phone: req.body.phone,
                    pwd: new_hashed_pwd,
                    salt: new_salt,
                    isAdmin: isadm
                }).then(function (User) {
                    if (User) {
                        const token = jwt.sign({ uid: User.uid }, process.env.JWT_ENCRYPTION);
                        res.status(200).send({ message: 'User registered. Pls verify mail' });
                        Mailer.mailer("Registration Successful", "You have been successfully registered.Click the link to verify- " + "<a href=\"http://localhost:3000/user/verify?salt=" + new_salt + "\">Verify</a>", User);
                        next();
                    }
                    else {
                        return res.status(400).send({ message: 'Server error' });
                    }
                });
            }
            else {
                return res.status(401).send({ message: 'User already exists' });
            }
        });
    });
};

exports.bid = (req, res, next) => {
    time = Date.now();
    if (req.body.price < 0) {
        return res.status(400).send({ message: 'Price must be positive' });
    }
    else {
        Products.findOne({ where: { pid: req.body.pid } }).then(function (Product) {
            if (!Product) {
                return res.status(400).send({ message: 'Product not found' });
            }
            else if (Product) {
                if(Product.sold==1)
                    return res.status(400).send({message:'Product sold'});
                else if(Product.starttime>time)
                    return res.status(400).send({message:'Bidding not yet started'});
                else if(Product.endtime<time)
                    return res.status(400).send({message:'Bidding expired'});
                else if(Product.base_price > req.body.price)
                    return res.status(400).send({message:'Bid amount should be greater than or equal to base price'});
                else {
                    Biddings.max('price', { where: { pid: req.body.pid } }).then(function (price) {
                        if (price >= req.body.price) {
                            return res.status(400).send({ message: 'Bid amount should be greater than other bids' });
                        }
                        else {
                            Biddings.findOne({ where: { uid: req.User.uid, pid: req.body.pid } }).then(function (Bid) {
                                if (Bid) {
                                    Bid.update({
                                        price: req.body.price
                                    }).then(function (bid) {
                                        res.status(200).send({ message:'Bid raised' ,bid:Bid});
                                        next();
                                    });
                                }
                                else{
                                    Biddings.create({
                                        uid: req.User.uid,
                                        pid: req.body.pid,
                                        price: req.body.price,
                                        isclosed: 0
                                    }).then(function (Bidding) {
                                        res.status(200).send({ message: 'Bid registered', Bid: Bidding });
                                        next();
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

exports.cancelbid = (req,res,next) => {
    Biddings.findOne({where:{pid:req.body.pid,uid:req.User.uid}}).then(function(Bid){
        if(!Bid){
            return res.status(400).send({message:'No such Bid found'});
        }
        else if(Bid){
            if(Bid.isclosed==1)
                return res.status(400).send({message:'Bid closed'});
            else{
                Biddings.destroy({where:{pid:req.body.pid,uid:req.User.uid}}).then(function(){
                    return res.status(200).send({message:'Bid cancelled successfully'});
                });
            }
        }
    })
}

exports.bidlist = (req,res,next) => {
    Biddings.findAll({where:{pid:req.query.pid},order:[['price','ASC']]}).then(function(Bidlist){
        if(Bidlist.list){
            return res.status(200).send({message:'List Found',bidlist:Bidlist});
        }
        else
            return res.status(400).send({message:'No list Found'});
    });
}

exports.mybids = (req,res,next) => {
    Biddings.findAll({where:{uid:req.User.uid},order:[['updatedAt','ASC']]}).then(function(Bidlist){
        if(Bidlist.length){
            return res.status(200).send({message:'List Found',bidlist:Bidlist});
        }
        else
            return res.status(400).send({message:'No list Found'});
    });
}

exports.mybuys = (req,res,next) => {
    Biddings.findAll({where:{uid:req.User.uid,isclosed:1},order:[['updatedAt','ASC']]}).then(function(Bidlist){
        if(Bidlist.length){
            return res.status(200).send({message:'List Found',list:Bidlist});
        }
        else
            return res.status(400).send({message:'No list Found'});
    });
}

exports.getProduct = (req, res, next) => {
    Products.findOne({ where: { pid: req.body.pid } }).then(function (Product) {
        if (Product) {
            return res.status(200).send({ message: 'Product found', product: Product });
        }
        else
            return res.status(400).send({ message: 'Product not found' });
    });
}

exports.listProduct = (req, res, next) => {
    Products.findAll().then(function (plist) {
        if (plist.length) {
            return res.status(200).send({ message: 'List Found', ProductList: plist });
        }
        else
            return res.status(400).send({ message: 'List not found' });
    });
}

exports.verify = (req, res, next) => {
    User.findOne({ where: { salt: req.query.salt } }).then(function (User) {
        if (User) {
            new_salt = uuidv1();
            User.update({
                uid: shortid.generate(),
                salt: new_salt
            }).then(function () {
                res.status(200).send({ message: 'Account Verified successfully. Login to continue' });
                next();
            });
        }
        else {
            return res.status(401).send({ message: 'Bad link' });
        }
    });
}

exports.signin = (req, res) => {
    User.findOne({ where: { email: req.body.email } }).then(function (User) {
        if (User) {
            new_hashed_pwd = crypto.createHash('sha1', User.salt).update(req.body.pwd).digest('hex');
            if (new_hashed_pwd === User.pwd) {
                const token = jwt.sign({ uid: User.uid }, process.env.JWT_ENCRYPTION);
                if (User.uid == 0)
                    return res.status(200).send({ message: 'User Signed in. Pls Verify mail' });
                else
                    return res.status(200).send({ message: 'User Signed in', uid: User.uid, token: token });
            }
            else {
                return res.status(400).send({ message: 'Wrong credentials' });
            }
        }
        else {
            return res.status(401).send({ message: 'User not found' });
        }
    });
};

exports.forgotPwd = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } }).then(function (User) {
        if (!User) {
            return res.status(400).send({ message: 'User not found' });
        }
        else if (User) {
            new_salt = uuidv1();
            User.update({
                salt: new_salt
            }).then(function () {
                Mailer.mailer("Reset Password", "Click link to finish password reset: " + "<a href=\"http://localhost:3000/user/resetpass?" + "salt=" + new_salt + "&pwd=" + req.body.pwd + "\">Reset password</a>", User);
                res.status(200).send({ message: 'Link sent to mail,Click once to complete reset' });
                next();
            });
        }
        else {
            return res.status(400).send({ message: 'User not found' });
        }
    });
};

exports.resetpass = (req, res, next) => {
    User.findOne({ where: { salt: req.query.salt } }).then(function (User) {
        if (User) {
            new_salt = uuidv1();
            new_hashed_pwd = crypto.createHash('sha1', new_salt).update(req.query.pwd).digest('hex');
            User.update({
                pwd: new_hashed_pwd,
                salt: new_salt
            }).then(function () {
                res.status(200).send({ message: 'Password reset successfully' });
                next();
            });
        }
        else {
            return res.status(401).send({ message: 'Bad link' });
        }
    });
}

exports.findUser = (req, res) => {
    User.findOne({ where: { uid: req.body.uid } }).then(function (User) {
        if (User) {
            return res.status(200).send({ message: 'Success', User: User });
        }
        else {
            return res.status(401).send({ message: 'User not found' });
        }
    });
};



