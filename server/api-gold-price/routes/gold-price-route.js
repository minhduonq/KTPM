const express = require('express');
const goldPriceController = require('../controllers/gold-price-controller');

const router = express.Router();

// router.get('/gold-price', goldPriceController.getGoldPrice);
//router.post('/update-gold-price', goldPriceController.setGoldPrice)
router.get('/', goldPriceController.loadMainPage)
router.get('/api/gold-price', goldPriceController.getGoldPrice)
module.exports = router;