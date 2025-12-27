const { Equipment, Department, MaintenanceTeam, User, MaintenanceRequest } = require('../models');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
exports.getAllEquipment = async (req, res) => {
    try {
        const { department_id, employee_id, team_id, is_scrapped } = req.query;

        const where = {};
        if (department_id) where.department_id = department_id;
        if (employee_id) where.employee_id = employee_id;
        if (team_id) where.team_id = team_id;
        if (is_scrapped !== undefined) where.is_scrapped = is_scrapped === 'true';

        const equipment = await Equipment.findAll({
            where,
            include: [
                { model: Department, as: 'department' },
                { model: User, as: 'employee' },
                { model: MaintenanceTeam, as: 'maintenanceTeam' },
                { model: User, as: 'defaultTechnician' }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: equipment.length,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id, {
            include: [
                { model: Department, as: 'department' },
                { model: User, as: 'employee' },
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

        res.status(200).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private (Admin, Manager)
exports.createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);

        const equipmentWithDetails = await Equipment.findByPk(equipment.id, {
            include: [
                { model: Department, as: 'department' },
                { model: User, as: 'employee' },
                { model: MaintenanceTeam, as: 'maintenanceTeam' },
                { model: User, as: 'defaultTechnician' }
            ]
        });

        res.status(201).json({
            success: true,
            data: equipmentWithDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Admin, Manager)
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        await equipment.update(req.body);

        const updatedEquipment = await Equipment.findByPk(equipment.id, {
            include: [
                { model: Department, as: 'department' },
                { model: User, as: 'employee' },
                { model: MaintenanceTeam, as: 'maintenanceTeam' },
                { model: User, as: 'defaultTechnician' }
            ]
        });

        res.status(200).json({
            success: true,
            data: updatedEquipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Admin)
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        await equipment.destroy();

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

// @desc    Get maintenance requests for equipment (Smart Button)
// @route   GET /api/equipment/:id/requests
// @access  Private
exports.getEquipmentRequests = async (req, res) => {
    try {
        const { stage } = req.query;

        const where = { equipment_id: req.params.id };
        if (stage) where.stage = stage;

        const requests = await MaintenanceRequest.findAll({
            where,
            include: [
                { model: User, as: 'assignedTechnician' },
                { model: MaintenanceTeam, as: 'team' },
                { model: User, as: 'creator' }
            ],
            order: [['created_at', 'DESC']]
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

// @desc    Get count of open requests for equipment (Smart Button Badge)
// @route   GET /api/equipment/:id/open-count
// @access  Private
exports.getOpenRequestCount = async (req, res) => {
    try {
        const count = await MaintenanceRequest.count({
            where: {
                equipment_id: req.params.id,
                stage: {
                    [require('sequelize').Op.in]: ['new', 'in_progress']
                }
            }
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
