const IncidentReport = require('../models/IncidentReport');
const asyncHandler = require('express-async-handler');

// @desc Get all incidents
// @route GET /api/incidents
const getIncidents = asyncHandler(async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  const incidents = await IncidentReport.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, count: incidents.length, data: incidents });
});

// @desc Create incident report
// @route POST /api/incidents
const createIncident = asyncHandler(async (req, res) => {
  const incident = await IncidentReport.create(req.body);
  const io = req.app.get('io');
  if (io) io.emit('incident.created', incident);
  res.status(201).json({ success: true, data: incident });
});

// @desc Update incident status
// @route PATCH /api/incidents/:id
const updateIncident = asyncHandler(async (req, res) => {
  const incident = await IncidentReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }
  res.json({ success: true, data: incident });
});

module.exports = { getIncidents, createIncident, updateIncident };
