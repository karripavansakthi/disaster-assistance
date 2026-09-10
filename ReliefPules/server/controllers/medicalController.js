const Hospital = require('../models/Hospital');
const asyncHandler = require('express-async-handler');

// @desc Get all hospitals
// @route GET /api/medical/hospitals
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find().sort({ status: 1 });
  res.json({ success: true, count: hospitals.length, data: hospitals });
});

// @desc Get hospital by ID
// @route GET /api/medical/hospitals/:id
const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  res.json({ success: true, data: hospital });
});

// @desc Get medical summary
// @route GET /api/medical/summary
const getMedicalSummary = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find();
  const summary = {
    totalHospitals: hospitals.length,
    totalDoctors: hospitals.reduce((s, h) => s + h.doctorsCount, 0),
    totalNurses: hospitals.reduce((s, h) => s + h.nursesCount, 0),
    totalAmbulances: hospitals.reduce((s, h) => s + h.ambulances, 0),
    totalAvailableBeds: hospitals.reduce((s, h) => s + h.availableBeds, 0),
    totalIcuBeds: hospitals.reduce((s, h) => s + h.icuBeds, 0),
    totalBloodUnits: hospitals.reduce((s, h) => s + h.bloodUnits, 0),
    criticalHospitals: hospitals.filter((h) => h.status === 'Critical').length,
  };
  res.json({ success: true, data: summary });
});

module.exports = { getHospitals, getHospitalById, getMedicalSummary };
