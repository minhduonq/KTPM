const express = require('express');
const FERateController = require('../controllers/fe-rate-controller');

const router = express.Router();

// router.get('/gold-price', goldPriceController.getGoldPrice);
//router.post('/update-gold-price', goldPriceController.setGoldPrice)
router.get('/', FERateController.loadMainPage)
router.get('/api/fe-rate', FERateController.getFERate)
module.exports = router;