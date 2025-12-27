const express = require('express');
const router = express.Router();
const {
    getAllTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllTeams);
router.get('/:id', protect, getTeam);
router.post('/', protect, authorize('admin', 'manager'), createTeam);
router.put('/:id', protect, authorize('admin', 'manager'), updateTeam);
router.delete('/:id', protect, authorize('admin'), deleteTeam);
router.post('/:id/members', protect, authorize('admin', 'manager'), addTeamMember);
router.delete('/:id/members/:userId', protect, authorize('admin', 'manager'), removeTeamMember);

module.exports = router;
