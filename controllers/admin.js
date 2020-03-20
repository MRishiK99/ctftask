const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const shortid = require('shortid');
const Products = require('../models').productlist;
const User = require('../models').User;
const Product = require('../models').productlist;
const Mailer = require('../controllers/utility');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Biddings = require('../models').biddings;
const bc = require('../controllers/bidcloser');


exports.updateProduct = (req,res,next) => {
    Product.findOne({where: {pid:req.body.pid}}).then(function(prod){
        if(!prod){
            return res.status(400).send({message:'Product not found'});
        }
        else if(prod){
            if(req.body.price) new_price = req.body.price; else new_price = prod.base_price;
            if(req.body.name) new_name = req.body.name; else new_name = prod.name;
            if(req.body.start) new_start = req.body.start; else new_start = prod.starttime;
            if(req.body.end) new_end = req.body.end; else new_end = prod.endtime;
            prod.update({
                name : new_name,
                base_price:new_price,
                starttime: new_start,
                endtime:new_end
            }).then(function(prod1){
                if(prod1){
                    bc.addAlarm(prod1);
                    res.status(200).send({message:'Product updated',Product:prod1});
                    next();
                }
                else
                    return res.status(400).send({message:'Error'});
            });
        }
    });
}

exports.addProduct = (req,res,next) => {
    Product.create({
        pid : shortid.generate(),
        name: req.body.name,
        base_price: req.body.price,
        starttime : req.body.start,
        endtime: req.body.end,
        sold: 0
    }).then(function(Product){
        if(Product){
            bc.addAlarm(Product);
            return res.status(200).send({message:'Product added',Product:Product});
        }
        else
            return res.status(400).send({message:'Error'});
    });
}


exports.delProduct = (req,res, next) => {
    Products.findOne({ where: {pid : req.body.pid }}).then(function(Product){
        if(Product){
            Biddings.findAll({where:{pid:req.body.pid}}).then(function(Bids){
                if(Bids.length){
                    return res.status(400).send({message:'Biddings exist for given product'});
                }
                else{
                    Products.destroy({where:{pid : req.body.pid}}).then(function(){
                        res.status(200).send({message:'Product deleted'});
                        next();
                    })
                }
            });
        }
        else
            return res.status(400).send({message:'Product not found'});
    });
}

exports.getProduct = (req,res, next) => {
    Products.findOne({ where: {pid : req.query.pid }}).then(function(Product){
        if(Product){
            return res.status(200).send({message:'Product found',product : Product});
        }
        else
            return res.status(400).send({message:'Product not found'});
    });
}

exports.listProduct = (req,res,next) => {
    Products.findAll().then(function(plist){
        if(plist){
            return res.status(200).send({message:'List Found',ProductList:plist});
        }
        else
            return res.status(400).send({message:'No list not found'});
    });
}
dotenv.config();