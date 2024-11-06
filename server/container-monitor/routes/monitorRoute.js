const express = require('express');
const con_stat_controller = require('../controllers/containers_status');
const endpoint_stat_controller = require('../controllers/endpoint_status')
const containers_usage_controller = require('../controllers/containers_usage')

const router = express.Router();

router.get('/containers-status',con_stat_controller.Containers_Status)
router.get('/endpoints-status', endpoint_stat_controller.Endpoint_Status)
router.get('/usage', containers_usage_controller.Containers_Usage_NO_Stream);
module.exports = router;