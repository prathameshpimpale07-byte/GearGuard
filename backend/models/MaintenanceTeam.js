const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceTeam = sequelize.define('MaintenanceTeam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    team_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'maintenance_teams',
    timestamps: true
});

module.exports = MaintenanceTeam;
