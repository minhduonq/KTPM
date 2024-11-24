const express = require('express');
const FERateController = require('../controllers/fe-rate-controller');

const router = express.Router();

router.get('/', FERateController.loadMainPage)
router.get('/api/fe-rate', FERateController.getFERate)


module.exports = router;