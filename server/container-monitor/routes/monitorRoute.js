const express = require('express');
const con_stat_controller = require('../controllers/containers_status');
const endpoint_stat_controller = require('../controllers/endpoint_status')
const tracking_controller = require('../controllers/visitTracking')
const router = express.Router();

router.get('/containers-status',con_stat_controller.Containers_Status)
router.get('/endpoints-status', endpoint_stat_controller.Endpoint_Status)
router.get('/visit-tracking', tracking_controller.visitTracking)

module.exports = router;