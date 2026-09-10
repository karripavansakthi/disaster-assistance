const express = require('express');
const router = express.Router();
const { getIncidents, createIncident, updateIncident } = require('../controllers/incidentController');

router.get('/', getIncidents);
router.post('/', createIncident);
router.patch('/:id', updateIncident);

module.exports = router;
