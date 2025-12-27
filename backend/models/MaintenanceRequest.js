const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('corrective', 'preventive'),
        allowNull: false,
        defaultValue: 'corrective'
    },
    stage: {
        type: DataTypes.ENUM('new', 'in_progress', 'repaired', 'scrap'),
        allowNull: false,
        defaultValue: 'new'
    },
    equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'equipment',
            key: 'id'
        }
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'maintenance_teams',
            key: 'id'
        }
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    scheduled_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Duration in hours'
    },
    scrap_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'maintenance_requests',
    timestamps: true
});

// Virtual field for checking if request is overdue
MaintenanceRequest.prototype.isOverdue = function () {
    if (!this.scheduled_date) return false;
    if (this.stage === 'repaired' || this.stage === 'scrap') return false;
    return new Date() > new Date(this.scheduled_date);
};

module.exports = MaintenanceRequest;
