const MissingPerson = require('../models/MissingPerson');
const asyncHandler = require('express-async-handler');

// @desc Get all missing persons (paginated)
// @route GET /api/reunification
const getMissingPersons = asyncHandler(async (req, res) => {
  const { status, district, name } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (district) filter.district = district;
  if (name) filter.name = { $regex: name, $options: 'i' };
  const records = await MissingPerson.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, count: records.length, data: records });
});

// @desc Report a missing person
// @route POST /api/reunification
const reportMissingPerson = asyncHandler(async (req, res) => {
  const record = await MissingPerson.create(req.body);
  const io = req.app.get('io');
  if (io) io.emit('missing.reported', { id: record._id, name: record.name });
  res.status(201).json({ success: true, data: record });
});

// @desc Update a missing person status
// @route PATCH /api/reunification/:id
const updateMissingPerson = asyncHandler(async (req, res) => {
  const record = await MissingPerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }
  res.json({ success: true, data: record });
});

module.exports = { getMissingPersons, reportMissingPerson, updateMissingPerson };
