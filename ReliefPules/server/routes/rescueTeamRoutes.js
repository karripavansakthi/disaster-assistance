const express = require('express');
const router = express.Router();
const { getRescueTeams, updateTeamStatus, getRescueSummary } = require('../controllers/rescueTeamController');

router.get('/', getRescueTeams);
router.get('/summary', getRescueSummary);
router.patch('/:id/status', updateTeamStatus);

module.exports = router;
