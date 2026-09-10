const Resource = require('../models/Resource');
const asyncHandler = require('express-async-handler');

// @desc Get all resources
// @route GET /api/resources
const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find().sort({ status: -1, category: 1 });
  res.json({ success: true, count: resources.length, data: resources });
});

// @desc Update resource quantity
// @route PATCH /api/resources/:id
const updateResource = asyncHandler(async (req, res) => {
  const { availableQuantity } = req.body;
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  resource.availableQuantity = availableQuantity ?? resource.availableQuantity;
  resource.lastUpdated = new Date();
  await resource.save();

  const io = req.app.get('io');
  if (io) io.emit('resource.updated', resource);

  res.json({ success: true, data: resource });
});

// @desc Get resource summary stats
// @route GET /api/resources/summary
const getResourceSummary = asyncHandler(async (req, res) => {
  const resources = await Resource.find();
  const summary = {
    total: resources.length,
    critical: resources.filter((r) => r.status === 'Critical').length,
    low: resources.filter((r) => r.status === 'Low').length,
    normal: resources.filter((r) => r.status === 'Normal').length,
  };
  res.json({ success: true, data: summary });
});

module.exports = { getResources, updateResource, getResourceSummary };
