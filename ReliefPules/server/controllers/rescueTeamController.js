const RescueTeam = require('../models/RescueTeam');
const asyncHandler = require('express-async-handler');

// @desc Get all rescue teams
// @route GET /api/rescue-teams
const getRescueTeams = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const teams = await RescueTeam.find(filter).sort({ status: 1 });
  res.json({ success: true, count: teams.length, data: teams });
});

// @desc Update rescue team status
// @route PATCH /api/rescue-teams/:id/status
const updateTeamStatus = asyncHandler(async (req, res) => {
  const { status, assignedSosId, etaMinutes, currentAssignment } = req.body;
  const team = await RescueTeam.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error('Rescue team not found');
  }
  if (status) team.status = status;
  if (assignedSosId !== undefined) team.assignedSosId = assignedSosId;
  if (etaMinutes !== undefined) team.etaMinutes = etaMinutes;
  if (currentAssignment) team.currentAssignment = currentAssignment;
  await team.save();

  const io = req.app.get('io');
  if (io) io.emit('rescue.updated', team);

  res.json({ success: true, data: team });
});

// @desc Get summary counts
// @route GET /api/rescue-teams/summary
const getRescueSummary = asyncHandler(async (req, res) => {
  const teams = await RescueTeam.find();
  res.json({
    success: true,
    data: {
      total: teams.length,
      available: teams.filter((t) => t.status === 'Available').length,
      assigned: teams.filter((t) => t.status === 'Assigned').length,
      enRoute: teams.filter((t) => t.status === 'En Route').length,
      onScene: teams.filter((t) => t.status === 'On Scene').length,
    },
  });
});

module.exports = { getRescueTeams, updateTeamStatus, getRescueSummary };
