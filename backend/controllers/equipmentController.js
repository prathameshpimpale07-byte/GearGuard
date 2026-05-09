const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
exports.getAllEquipment = async (req, res) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Equipment.find(JSON.parse(queryStr))
            .populate('department', 'name')
            .populate('maintenance_team', 'team_name')
            .populate('assigned_employee', 'name');

        const equipment = await query;

        res.status(200).json({ success: true, count: equipment.length, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('department', 'name')
            .populate('maintenance_team', 'team_name')
            .populate('assigned_employee', 'name email');

        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }

        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private/Admin/Manager
exports.createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin/Manager
exports.updateEquipment = async (req, res) => {
    try {
        let equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }

        equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }

        await equipment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get requests for specific equipment
// @desc    Get equipment requests
// @route   GET /api/equipment/:id/requests
// @access  Private
exports.getEquipmentRequests = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');
        const requests = await MaintenanceRequest.find({ equipment: req.params.id })
            .populate('assigned_team', 'team_name')
            .populate('assigned_technician', 'name')
            .populate('created_by', 'name');

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get open request count for specific equipment
// @desc    Get open request count
// @route   GET /api/equipment/:id/open-count
// @access  Private
exports.getOpenRequestCount = async (req, res) => {
    try {
        const MaintenanceRequest = require('../models/MaintenanceRequest');
        const count = await MaintenanceRequest.countDocuments({
            equipment: req.params.id,
            status: { $in: ['new', 'in_progress', 'on_hold'] }
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

