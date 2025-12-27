const { MaintenanceTeam, TeamMember, User } = require('../models');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await MaintenanceTeam.findAll({
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email', 'role', 'avatar']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email', 'role', 'avatar']
                }
            ]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create team
// @route   POST /api/teams
// @access  Private (Admin, Manager)
exports.createTeam = async (req, res) => {
    try {
        const { team_name, description } = req.body;

        const team = await MaintenanceTeam.create({
            team_name,
            description
        });

        res.status(201).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin, Manager)
exports.updateTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findByPk(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.update(req.body);

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin)
exports.deleteTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findByPk(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add team member
// @route   POST /api/teams/:id/members
// @access  Private (Admin, Manager)
exports.addTeamMember = async (req, res) => {
    try {
        const { user_id } = req.body;
        const team_id = req.params.id;

        // Check if team exists
        const team = await MaintenanceTeam.findByPk(team_id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already a member
        const existing = await TeamMember.findOne({
            where: { team_id, user_id }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member of this team'
            });
        }

        // Add member
        await TeamMember.create({ team_id, user_id });

        // Return updated team
        const updatedTeam = await MaintenanceTeam.findByPk(team_id, {
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email', 'role', 'avatar']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove team member
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private (Admin, Manager)
exports.removeTeamMember = async (req, res) => {
    try {
        const team_id = req.params.id;
        const user_id = req.params.userId;

        const teamMember = await TeamMember.findOne({
            where: { team_id, user_id }
        });

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        await teamMember.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
