const DisasterAlert = require('../models/DisasterAlert');
const EmergencyRequest = require('../models/EmergencyRequest');
const Shelter = require('../models/Shelter');

// @desc    Get active disaster alerts
// @route   GET /api/alerts/active
// @access  Public
const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await DisasterAlert.find({ isActive: true }).sort({
      broadcastTime: -1,
    });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new disaster warning alert
// @route   POST /api/alerts
// @access  Private / Admin
const createAlert = async (req, res, next) => {
  try {
    const {
      title,
      disasterType,
      severity,
      affectedAreas,
      message,
      evacuationRequired,
      emergencyHelpline,
      issuedBy,
    } = req.body;

    if (!title || !disasterType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alert title, disaster type, and alert message.',
      });
    }

    const alert = await DisasterAlert.create({
      title,
      disasterType,
      severity: severity || 'warning',
      affectedAreas: affectedAreas || [],
      message,
      evacuationRequired: Boolean(evacuationRequired),
      emergencyHelpline: emergencyHelpline || '1070',
      issuedBy: issuedBy || 'National Disaster Management Authority (NDMA)',
    });

    res.status(201).json({
      success: true,
      message: 'Disaster warning alert broadcasted successfully',
      alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate platform stats for landing page & dashboard
// @route   GET /api/alerts/stats
// @access  Public
const getDisasterStats = async (req, res, next) => {
  try {
    const [
      pendingRequests,
      resolvedRequests,
      totalRequests,
      shelters,
      activeAlertsCount,
    ] = await Promise.all([
      EmergencyRequest.countDocuments({ status: { $in: ['pending', 'dispatched', 'in_progress'] } }),
      EmergencyRequest.countDocuments({ status: { $in: ['rescued', 'resolved'] } }),
      EmergencyRequest.countDocuments(),
      Shelter.find({ status: { $ne: 'closed' } }),
      DisasterAlert.countDocuments({ isActive: true }),
    ]);

    let totalCapacity = 0;
    let totalOccupancy = 0;
    shelters.forEach((s) => {
      totalCapacity += s.totalCapacity || 0;
      totalOccupancy += s.currentOccupancy || 0;
    });

    const availableBeds = Math.max(0, totalCapacity - totalOccupancy);
    const safeSheltersCount = shelters.length;

    res.status(200).json({
      success: true,
      stats: {
        activeSosRequests: pendingRequests,
        rescuedVictims: resolvedRequests,
        totalSosRecorded: totalRequests,
        safeSheltersCount,
        totalBedCapacity: totalCapacity,
        availableBeds,
        occupancyRate: totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
        activeAlertsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveAlerts,
  createAlert,
  getDisasterStats,
};
