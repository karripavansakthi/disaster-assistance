const express = require('express');
const router = express.Router();
const { getDisasterStatus } = require('../controllers/statusController');

router.get('/', getDisasterStatus);

module.exports = router;
