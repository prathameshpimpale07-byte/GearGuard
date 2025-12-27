const { User, MaintenanceTeam, Department } = require('../models');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Manager)
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;

        const where = {};
        if (role) where.role = role;

        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'teams',
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    as: 'department'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'teams',
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    as: 'department'
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.update(req.body);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.destroy();

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

// @desc    Get technicians (users with technician role)
// @route   GET /api/users/technicians
// @access  Private
exports.getTechnicians = async (req, res) => {
    try {
        const technicians = await User.findAll({
            where: { role: 'technician' },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'teams',
                    through: { attributes: [] }
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: technicians.length,
            data: technicians
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
