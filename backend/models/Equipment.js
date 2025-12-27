const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipment = sequelize.define('Equipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    serial_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    warranty_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'departments',
            key: 'id'
        }
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
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
    default_technician_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    is_scrapped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    scrap_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'equipment',
    timestamps: true
});

module.exports = Equipment;
