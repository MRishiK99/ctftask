const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth');
const User = require('../controllers/user');
const Validator = require('../validators/index');


router.post('/register', Validator.userSignupValidator, User.register);
router.post('/login', Validator.userSigninValidator, User.signin);
router.get('/verify',Validator.verifylinkValidator,User.verify);
router.get('/resetpass',Validator.resetlinkValidator,User.resetpass);
router.post('/forgotPwd', Validator.userForgotPwdValidator, User.forgotPwd);

router.get('/getProd',Validator.getProductValidator,Auth.checkAuthUser,User.getProduct);
router.get('/listProd',Auth.checkAuthUser,User.listProduct);

router.post('/cancelbid',Validator.getProductValidator,Auth.checkAuthUser,User.cancelbid);
router.get('/mybids',Auth.checkAuthUser,User.mybids);
router.get('/mybuys',Auth.checkAuthUser,User.mybuys);
router.post('/bid',Validator.bidValidator,Auth.checkAuthUser,User.bid);
router.get('/listbid',Validator.listbidValidator,Auth.checkAuthUser,User.bidlist);

module.exports = router;

