const express = require('express');
const router = express.Router();


const Auth = require('../controllers/auth');
const Admin = require('../controllers/admin');
const Utility = require('../controllers/utility');
const Validator = require('../validators/index');

router.post('/addProd',Validator.addProductValidator,Auth.checkAuthAdmin,Admin.addProduct);
router.get('/getProd',Validator.getProductValidator,Auth.checkAuthAdmin,Admin.getProduct);
router.post('/delProd',Validator.delProductValidator,Auth.checkAuthAdmin,Admin.delProduct);
router.get('/listProd',Auth.checkAuthAdmin,Admin.listProduct);
router.post('/updateProd',Validator.updateProductValidator,Auth.checkAuthAdmin,Admin.updateProduct)

module.exports = router;
