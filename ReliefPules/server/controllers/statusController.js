const DisasterStatus = require('../models/DisasterStatus');
const EmergencyRequest = require('../models/EmergencyRequest');
const Shelter = require('../models/Shelter');
const Hospital = require('../models/Hospital');
const asyncHandler = require('express-async-handler');

// @desc Get live disaster status
// @route GET /api/status
const getDisasterStatus = asyncHandler(async (req, res) => {
  let status = await DisasterStatus.findOne().sort({ updatedAt: -1 });

  // Dynamically compute real-time counts from DB
  const [activeSos, openShelters, allHospitals] = await Promise.all([
    EmergencyRequest.countDocuments({ status: { $in: ['pending', 'assigned', 'en_route', 'on_scene'] } }),
    Shelter.find({ status: { $in: ['open', 'limited'] } }, 'totalCapacity currentOccupancy ambulancesCount'),
    Hospital.find({}, 'ambulances status'),
  ]);

  const bedsAvailable = openShelters.reduce((sum, s) => sum + Math.max(0, s.totalCapacity - s.currentOccupancy), 0);
  const ambulancesAvailable = allHospitals.reduce((sum, h) => sum + h.ambulances, 0);

  if (status) {
    status = status.toObject();
    status.activeSosCount = activeSos;
    status.sheltersOpenCount = openShelters.length;
    status.bedsAvailableCount = bedsAvailable;
    status.ambulancesAvailableCount = ambulancesAvailable;
  } else {
    status = {
      activeSosCount: activeSos,
      sheltersOpenCount: openShelters.length,
      bedsAvailableCount: bedsAvailable,
      ambulancesAvailableCount: ambulancesAvailable,
      dataAvailable: false,
      message: 'No disaster status record is available.',
    };
  }

  res.json({ success: true, data: status });
});

module.exports = { getDisasterStatus };
