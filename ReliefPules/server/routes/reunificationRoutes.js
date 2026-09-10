const express = require('express');
const router = express.Router();
const { getMissingPersons, reportMissingPerson, updateMissingPerson } = require('../controllers/reunificationController');

router.get('/', getMissingPersons);
router.post('/', reportMissingPerson);
router.patch('/:id', updateMissingPerson);

module.exports = router;
