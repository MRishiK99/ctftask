
const { oneOf } = require('express-validator');

exports.userSignupValidator = (req,res,next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("phone", "Phone number is required").notEmpty();   
    req.check("email", "Email is required").notEmpty();
    req.check("email","Email must be between 3 nd 32 chars")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 3,
            max: 31
        });
    req.check("pwd", "Password is required").notEmpty();
    req.check("pwd")
        .isLength({min:6})
        .withMessage("Password must contain atleast six characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.userSigninValidator = (req,res,next) => {
    req.check("email", "Email is required").notEmpty();
    req.check("email","Email must be between 3 nd 32 chars")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 3,
            max: 31
        });
    req.check("pwd", "Password is required").notEmpty();
    req.check("pwd")
        .isLength({min:6})
        .withMessage("Password must contain atleast six characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.userForgotPwdValidator = (req,res,next) => {
    req.check("email", "Email is required").notEmpty();
    req.check("email","Email must be between 3 nd 32 chars")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 3,
            max: 31
        });
    req.check("pwd", "Password is required").notEmpty();
    req.check("pwd")
        .isLength({min:6})
        .withMessage("Password must contain atleast six characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}


exports.bidValidator = (req,res,next) => {
    req.check("pid","Product ID is required").notEmpty();
    req.check("price","Bid amount is required").notEmpty();
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.listbidValidator = (req,res,next) => {
    req.check("pid","Product ID is required").notEmpty();
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.addProductValidator = (req,res,next) => {
    req.check("price", "Base price is required").notEmpty();
    req.check("name", "Name is required").notEmpty();
    req.check("start", "Start time is required").notEmpty();
    req.check("end", "End time is required").notEmpty();
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.updateProductValidator = (req,res,next) => {
    req.check("pid", "Product ID is required").notEmpty();
    req.check("price", "Base price is required").notEmpty();
    req.check("name", "Name is required").notEmpty();
    req.check("start", "Start time is required").notEmpty();
    req.check("end", "End time is required").notEmpty();
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}


exports.getProductValidator = (req,res,next) => {
    req.check("pid", "Pid is required").notEmpty();    
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.resetlinkValidator = (req,res,next) => {
    req.check("salt", "Bad Link").notEmpty();
    req.check("pwd", "Bad Link").notEmpty();    
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.verifylinkValidator = (req,res,next) => {
    req.check("salt", "Bad Link").notEmpty();
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}

exports.delProductValidator = (req,res,next) => {
    req.check("pid", "Pid is required").notEmpty();    
    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next();
}









