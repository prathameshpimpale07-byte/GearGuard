const User = require('../models/user');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Counts
        const totalUsers = await User.countDocuments();
        const technicians = await User.countDocuments({ role: 'technician' });
        const totalEquipment = await Equipment.countDocuments();
        const activeEquipment = await Equipment.countDocuments({ status: 'active' });
        const totalTeams = await MaintenanceTeam.countDocuments();
        const totalRequests = await MaintenanceRequest.countDocuments();
        const openRequests = await MaintenanceRequest.countDocuments({ stage: { $in: ['new', 'in-progress'] } });
        const criticalRequests = await MaintenanceRequest.countDocuments({ priority: 'high', stage: { $ne: 'repaired' } });

        // 2. Recent Activity (Last 5 requests)
        const recentRequests = await MaintenanceRequest.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('equipment', 'name')
            .populate('assigned_technician', 'name');

        // 3. Request Status Distribution (for charts)
        const statusDistribution = await MaintenanceRequest.aggregate([
            { $group: { _id: '$stage', count: { $sum: 1 } } }
        ]);

        // 4. Priority Distribution (for charts)
        const priorityDistribution = await MaintenanceRequest.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    totalUsers,
                    technicians,
                    totalEquipment,
                    activeEquipment,
                    totalTeams,
                    totalRequests,
                    openRequests,
                    criticalRequests
                },
                recentRequests,
                charts: {
                    status: statusDistribution,
                    priority: priorityDistribution
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
