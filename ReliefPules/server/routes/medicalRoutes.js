const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById, getMedicalSummary } = require('../controllers/medicalController');

router.get('/', getHospitals);
router.get('/summary', getMedicalSummary);
router.get('/hospitals', getHospitals);
router.get('/hospitals/:id', getHospitalById);

module.exports = router;
