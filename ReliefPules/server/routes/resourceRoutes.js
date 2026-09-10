const express = require('express');
const router = express.Router();
const { getResources, updateResource, getResourceSummary } = require('../controllers/resourceController');

router.get('/', getResources);
router.get('/summary', getResourceSummary);
router.patch('/:id', updateResource);

module.exports = router;
