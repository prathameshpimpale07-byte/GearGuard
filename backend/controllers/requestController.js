const { MaintenanceRequest, Equipment, MaintenanceTeam, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all maintenance requests
// @route   GET /api/requests
// @access  Private
exports.getAllRequests = async (req, res) => {
    try {
        const { stage, type, team_id, assigned_to } = req.query;

        const where = {};
        if (stage) where.stage = stage;
        if (type) where.type = type;
        if (team_id) where.team_id = team_id;
        if (assigned_to) where.assigned_to = assigned_to;

        const requests = await MaintenanceRequest.findAll({
            where,
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' },
                { model: User, as: 'creator' }
            ],
            order: [['created_at', 'DESC']]
        });

        // Add isOverdue field to each request
        const requestsWithOverdue = requests.map(req => ({
            ...req.toJSON(),
            isOverdue: req.isOverdue()
        }));

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requestsWithOverdue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByPk(req.params.id, {
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' },
                { model: User, as: 'creator' }
            ]
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...request.toJSON(),
                isOverdue: request.isOverdue()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create maintenance request with AUTO-FILL logic
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
    try {
        const { equipment_id, subject, description, type, scheduled_date } = req.body;

        // Get equipment details for auto-fill
        const equipment = await Equipment.findByPk(equipment_id, {
            include: [
                { model: MaintenanceTeam, as: 'maintenanceTeam' },
                { model: User, as: 'defaultTechnician' }
            ]
        });

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // AUTO-FILL: team_id from equipment
        const team_id = equipment.team_id;

        // AUTO-FILL: assigned_to from equipment's default technician (optional)
        const assigned_to = equipment.default_technician_id || null;

        // Create request with auto-filled data
        const request = await MaintenanceRequest.create({
            subject,
            description,
            type: type || 'corrective',
            equipment_id,
            team_id, // Auto-filled
            assigned_to, // Auto-filled from default technician
            scheduled_date,
            created_by: req.user.id,
            stage: 'new'
        });

        const requestWithDetails = await MaintenanceRequest.findByPk(request.id, {
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' },
                { model: User, as: 'creator' }
            ]
        });

        res.status(201).json({
            success: true,
            data: requestWithDetails,
            message: 'Request created with auto-filled team and technician'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update maintenance request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        await request.update(req.body);

        const updatedRequest = await MaintenanceRequest.findByPk(request.id, {
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' },
                { model: User, as: 'creator' }
            ]
        });

        res.status(200).json({
            success: true,
            data: updatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Change request stage (with scrap logic)
// @route   PUT /api/requests/:id/stage
// @access  Private
exports.changeStage = async (req, res) => {
    try {
        const { stage, duration, scrap_reason } = req.body;

        const request = await MaintenanceRequest.findByPk(req.params.id, {
            include: [{ model: Equipment, as: 'equipment' }]
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Update stage
        request.stage = stage;

        // If moving to repaired, duration is required
        if (stage === 'repaired' && duration) {
            request.duration = duration;
        }

        // SCRAP LOGIC: If moving to scrap, mark equipment
        if (stage === 'scrap') {
            request.scrap_reason = scrap_reason;

            // Mark equipment as scrapped
            const equipment = await Equipment.findByPk(request.equipment_id);
            if (equipment) {
                equipment.is_scrapped = true;
                equipment.scrap_notes = scrap_reason || 'Marked as scrap from maintenance request';
                await equipment.save();
            }
        }

        await request.save();

        const updatedRequest = await MaintenanceRequest.findByPk(request.id, {
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' }
            ]
        });

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: stage === 'scrap' ? 'Request scrapped and equipment marked as unusable' : 'Stage updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get calendar requests (preventive only)
// @route   GET /api/requests/calendar
// @access  Private
exports.getCalendarRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.findAll({
            where: {
                type: 'preventive',
                scheduled_date: {
                    [Op.not]: null
                }
            },
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' }
            ],
            order: [['scheduled_date', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get overdue requests
// @route   GET /api/requests/overdue
// @access  Private
exports.getOverdueRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.findAll({
            where: {
                scheduled_date: {
                    [Op.lt]: new Date()
                },
                stage: {
                    [Op.in]: ['new', 'in_progress']
                }
            },
            include: [
                { model: Equipment, as: 'equipment' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'assignedTechnician' }
            ],
            order: [['scheduled_date', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin, Manager)
exports.deleteRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        await request.destroy();

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
