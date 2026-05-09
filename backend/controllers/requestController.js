const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
exports.getAllRequests = async (req, res) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        query = MaintenanceRequest.find(reqQuery)
            .populate('equipment', 'name serial_number')
            .populate('assigned_team', 'team_name')
            .populate('assigned_technician', 'name')
            .populate('created_by', 'name');

        const requests = await query;

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id)
            .populate('equipment')
            .populate('assigned_team')
            .populate('assigned_technician')
            .populate('created_by');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
    try {
        req.body.created_by = req.user.id;

        // Auto assignment logic based on equipment team
        const equipment = await Equipment.findById(req.body.equipment_id);
        if (equipment) {
            req.body.assigned_team = equipment.maintenance_team;
        }

        const request = await MaintenanceRequest.create(req.body);
        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res) => {
    try {
        let request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Scrap Logic
        if (req.body.stage === 'scrap') {
            const equipment = await Equipment.findById(request.equipment);
            if (equipment) {
                equipment.status = 'scrapped';
                await equipment.save();
            }
        }

        request = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private/Admin
exports.deleteRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        await request.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change request stage
// @route   PUT /api/requests/:id/stage
// @access  Private
exports.changeStage = async (req, res) => {
    try {
        const { stage } = req.body;
        let request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        request.stage = stage;

        // Handle equipment status based on stage
        if (stage === 'scrap') {
            const equipment = await Equipment.findById(request.equipment);
            if (equipment) {
                equipment.status = 'scrapped';
                await equipment.save();
            }
        }

        await request.save();
        if (stage === 'repaired') {
            request.completion_date = Date.now();
        }

        await request.save();

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get requests for calendar
// @desc    Get calendar requests
// @route   GET /api/requests/calendar
// @access  Private
exports.getCalendarRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({
            scheduled_date: { $exists: true, $ne: null }
        })
            .populate('equipment', 'name')
            .select('subject scheduled_date type');

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get overdue requests
// @route   GET /api/requests/overdue
// @access  Private
exports.getOverdueRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({
            scheduled_date: { $lt: new Date() },
            stage: { $in: ['new', 'in-progress'] }
        }).populate('equipment', 'name');

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

