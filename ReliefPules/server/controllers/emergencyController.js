const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const Shelter = require('../models/Shelter');
const { runAiTriage } = require('../services/groqService');
const asyncHandler = require('express-async-handler');

// @desc Submit SOS emergency request with AI triage
// @route POST /api/emergency
// @access Public / Private
const createEmergency = asyncHandler(async (req, res) => {
  const {
    victimName,
    phone,
    alternatePhone,
    disasterType,
    assistanceType,
    assistanceRequired,
    priority,
    medicalEmergency,
    location,
    peopleCount,
    vulnerablePeople,
    description,
  } = req.body;

  if (!victimName && !req.user?.name) {
    return res.status(400).json({ success: false, message: 'A reporter name is required.' });
  }
  if (!phone && !req.user?.phone) {
    return res.status(400).json({ success: false, message: 'A contact phone number is required.' });
  }

  // Determine assistance items
  const assistanceList = Array.isArray(assistanceRequired) && assistanceRequired.length > 0
    ? assistanceRequired
    : (assistanceType ? [assistanceType] : ['rescue', 'food']);

  const isMedical = !!medicalEmergency || assistanceList.includes('medical') || (vulnerablePeople?.injured > 0);

  // Run AI / deterministic triage
  const triageInput = {
    disasterType: disasterType || 'flood',
    assistanceType: assistanceType || (assistanceList.includes('rescue') ? 'rescue' : 'food_water'),
    medicalEmergency: isMedical,
    peopleCount: Number(peopleCount) || 1,
    children: vulnerablePeople?.children || 0,
    elderly: vulnerablePeople?.elderly || 0,
    injured: vulnerablePeople?.injured || 0,
    disabled: vulnerablePeople?.disabled || 0,
    pregnant: vulnerablePeople?.pregnant || 0,
    description: description || '',
  };

  const triage = await runAiTriage(triageInput);

  // If explicit priority was supplied by user, respect it
  let finalSeverity = triage.severity;
  let finalPriorityScore = triage.priorityScore;
  if (priority) {
    const pLower = priority.toLowerCase();
    if (pLower === 'critical') {
      finalSeverity = 'critical';
      finalPriorityScore = Math.max(85, finalPriorityScore);
    } else if (pLower === 'high') {
      finalSeverity = 'high';
      finalPriorityScore = Math.max(65, Math.min(84, finalPriorityScore));
    } else if (pLower === 'medium' || pLower === 'moderate') {
      finalSeverity = 'moderate';
      finalPriorityScore = Math.max(40, Math.min(64, finalPriorityScore));
    } else if (pLower === 'low') {
      finalSeverity = 'low';
      finalPriorityScore = Math.min(39, finalPriorityScore);
    }
  }

  // Safe location coords
  const lat = Number(location?.coordinates?.lat ?? location?.lat);
  const lng = Number(location?.coordinates?.lng ?? location?.lng);
  if (!location?.address || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ success: false, message: 'A valid address and latitude/longitude are required.' });
  }
  const safeLocation = {
    address: location.address.trim(),
    city: location.city || location.district || '',
    district: location.district || location.city || '',
    coordinates: { lat, lng },
  };

  const now = new Date();
  const rescueTimeline = [
    { stage: 'Request Received', timestamp: now, notes: 'Emergency distress registered.', completed: true },
  ];

  const emergency = await EmergencyRequest.create({
    victim: req.user?._id || req.body.victim || null,
    victimName: victimName || req.user?.name,
    phone: phone || req.user?.phone,
    alternatePhone: alternatePhone || '',
    disasterType: (disasterType || 'flood').toLowerCase(),
    assistanceType: triageInput.assistanceType,
    assistanceRequired: assistanceList,
    medicalEmergency: isMedical,
    location: safeLocation,
    peopleCount: Number(peopleCount) || 1,
    vulnerablePeople: vulnerablePeople || {},
    description: description || 'Emergency assistance requested via portal.',
    severity: finalSeverity,
    priorityScore: finalPriorityScore,
    triageReason: triage.triageReason,
    rescueTimeline,
    status: 'pending',
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('sos.created', {
      sosId: emergency.sosId,
      severity: emergency.severity,
      priorityScore: emergency.priorityScore,
      location: emergency.location,
      peopleCount: emergency.peopleCount,
      createdAt: emergency.createdAt,
    });
    io.to('commandCenter').emit('sos.created', emergency);
  }

  res.status(201).json({
    success: true,
    message: 'SOS registered and AI triage completed.',
    data: {
      ...emergency.toObject(),
      triage: {
        priorityScore: triage.priorityScore,
        severity: triage.severity,
        reason: triage.triageReason,
      },
    },
  });
});

// @desc Get all emergency requests
// @route GET /api/emergency
// @access Private
const getEmergencies = asyncHandler(async (req, res) => {
  const { status, severity, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;

  const requests = await EmergencyRequest.find(filter)
    .sort({ priorityScore: -1, createdAt: -1 })
    .limit(Number(limit))
    .populate('victim', 'name email');

  res.json({ success: true, count: requests.length, data: requests });
});

const getMyEmergencies = asyncHandler(async (req, res) => {
  const requests = await EmergencyRequest.find({ victim: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, count: requests.length, data: requests });
});

// @desc Get single emergency by ID or sosId
// @route GET /api/emergency/:id
// @access Public
const getEmergencyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let emergency;

  if (id.startsWith('RP-') || id.startsWith('REQ') || id.startsWith('req')) {
    emergency = await EmergencyRequest.findOne({ sosId: { $regex: new RegExp(`^${id}$`, 'i') } });
  } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
    emergency = await EmergencyRequest.findById(id);
  } else {
    emergency = await EmergencyRequest.findOne({ sosId: id });
  }

  if (!emergency) {
    res.status(404);
    throw new Error('Emergency request not found');
  }

  const operationalRoles = ['admin', 'rescue', 'volunteer', 'coordinator'];
  if (!operationalRoles.includes(req.user.role) && String(emergency.victim) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You are not authorized to view this emergency request.');
  }

  res.json({ success: true, data: emergency });
});

// @desc Update emergency status and assign volunteers
// @route PATCH /api/emergency/:id/status
// @access Public / Private
const updateEmergencyStatus = asyncHandler(async (req, res) => {
  const { status, notes, assignedTeam, assignedVolunteer } = req.body;
  const { id } = req.params;
  let emergency;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    emergency = await EmergencyRequest.findById(id);
  } else {
    emergency = await EmergencyRequest.findOne({ sosId: { $regex: new RegExp(`^${id}$`, 'i') } });
  }

  if (!emergency) {
    res.status(404);
    throw new Error('Emergency request not found');
  }

  const allowedTransitions = {
    pending: ['assigned', 'cancelled'],
    assigned: ['en_route', 'cancelled'],
    en_route: ['on_scene', 'cancelled'],
    on_scene: ['rescued', 'resolved', 'cancelled'],
    rescued: ['resolved'],
    resolved: [],
    cancelled: [],
  };
  if (status && status !== emergency.status && !allowedTransitions[emergency.status]?.includes(status)) {
    res.status(409);
    throw new Error(`Cannot change emergency status from ${emergency.status} to ${status}.`);
  }

  if (status) emergency.status = status;
  if (assignedTeam) emergency.assignedTeam = { ...emergency.assignedTeam, ...assignedTeam };
  if (assignedVolunteer) emergency.assignedVolunteer = assignedVolunteer;

  if (notes || status) {
    emergency.rescueTimeline.push({
      stage: status ? `Status: ${status.replace('_', ' ').toUpperCase()}` : 'Update Logged',
      timestamp: new Date(),
      notes: notes || `Emergency status updated to ${status}.`,
      completed: true,
    });
  }

  await emergency.save();

  const io = req.app.get('io');
  if (io) {
    io.emit('sos.updated', { sosId: emergency.sosId, status: emergency.status, notes });
  }

  res.json({ success: true, data: emergency });
});

// @desc Get emergency stats for command center
// @route GET /api/emergency/stats
const getEmergencyStats = asyncHandler(async (req, res) => {
  const [
    total,
    pending,
    assigned,
    critical,
    high,
    moderate,
    victimCount,
    sheltersCount,
    volunteerCount,
    recentRequests,
  ] = await Promise.all([
    EmergencyRequest.countDocuments(),
    EmergencyRequest.countDocuments({ status: 'pending' }),
    EmergencyRequest.countDocuments({ status: { $in: ['assigned', 'en_route', 'on_scene'] } }),
    EmergencyRequest.countDocuments({ severity: 'critical' }),
    EmergencyRequest.countDocuments({ severity: 'high' }),
    EmergencyRequest.countDocuments({ severity: 'moderate' }),
    User.countDocuments({ role: { $in: ['victim', 'citizen'] } }),
    Shelter.countDocuments({ status: { $in: ['open', 'limited'] } }),
    User.countDocuments({ role: { $in: ['volunteer', 'rescue'] } }),
    req.user ? EmergencyRequest.find().sort({ createdAt: -1 }).limit(10) : Promise.resolve([]),
  ]);

  const peopleAgg = await EmergencyRequest.aggregate([
    { $group: { _id: null, totalPeople: { $sum: '$peopleCount' } } },
  ]);
  const sumPeople = peopleAgg[0]?.totalPeople || 0;

  const activeEmergencies = pending + assigned;

  res.json({
    success: true,
    data: {
      totalVictims: victimCount + sumPeople,
      activeEmergencies,
      availableShelters: sheltersCount,
      volunteers: volunteerCount,
      total,
      pending,
      assigned,
      resolved: Math.max(0, total - pending - assigned),
      bySeverity: { critical, high, moderate, low: Math.max(0, total - critical - high - moderate) },
      ...(req.user ? { recentRequests } : {}),
    },
  });
});

module.exports = { createEmergency, getEmergencies, getMyEmergencies, getEmergencyById, updateEmergencyStatus, getEmergencyStats };
