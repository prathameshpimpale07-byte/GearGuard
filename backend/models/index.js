const sequelize = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const MaintenanceTeam = require('./MaintenanceTeam');
const TeamMember = require('./TeamMember');
const Equipment = require('./Equipment');
const MaintenanceRequest = require('./MaintenanceRequest');

// Define associations

// User - Department (One Department has many Users)
Department.hasMany(User, { foreignKey: 'department_id', as: 'employees' });
User.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// MaintenanceTeam - TeamMember - User (Many-to-Many)
MaintenanceTeam.hasMany(TeamMember, { foreignKey: 'team_id', as: 'teamMembers', onDelete: 'CASCADE' });
TeamMember.belongsTo(MaintenanceTeam, { foreignKey: 'team_id', as: 'team' });

User.hasMany(TeamMember, { foreignKey: 'user_id', as: 'teamMemberships', onDelete: 'CASCADE' });
TeamMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MaintenanceTeam - User (through TeamMember)
MaintenanceTeam.belongsToMany(User, {
    through: TeamMember,
    foreignKey: 'team_id',
    otherKey: 'user_id',
    as: 'members'
});
User.belongsToMany(MaintenanceTeam, {
    through: TeamMember,
    foreignKey: 'user_id',
    otherKey: 'team_id',
    as: 'teams'
});

// Equipment - Department
Department.hasMany(Equipment, { foreignKey: 'department_id', as: 'equipment' });
Equipment.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Equipment - User (employee)
User.hasMany(Equipment, { foreignKey: 'employee_id', as: 'ownedEquipment' });
Equipment.belongsTo(User, { foreignKey: 'employee_id', as: 'employee' });

// Equipment - MaintenanceTeam
MaintenanceTeam.hasMany(Equipment, { foreignKey: 'team_id', as: 'equipment' });
Equipment.belongsTo(MaintenanceTeam, { foreignKey: 'team_id', as: 'maintenanceTeam' });

// Equipment - User (default technician)
User.hasMany(Equipment, { foreignKey: 'default_technician_id', as: 'assignedEquipment' });
Equipment.belongsTo(User, { foreignKey: 'default_technician_id', as: 'defaultTechnician' });

// MaintenanceRequest - Equipment
Equipment.hasMany(MaintenanceRequest, { foreignKey: 'equipment_id', as: 'maintenanceRequests', onDelete: 'CASCADE' });
MaintenanceRequest.belongsTo(Equipment, { foreignKey: 'equipment_id', as: 'equipment' });

// MaintenanceRequest - MaintenanceTeam
MaintenanceTeam.hasMany(MaintenanceRequest, { foreignKey: 'team_id', as: 'requests' });
MaintenanceRequest.belongsTo(MaintenanceTeam, { foreignKey: 'team_id', as: 'team' });

// MaintenanceRequest - User (assigned to)
User.hasMany(MaintenanceRequest, { foreignKey: 'assigned_to', as: 'assignedRequests' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTechnician' });

// MaintenanceRequest - User (created by)
User.hasMany(MaintenanceRequest, { foreignKey: 'created_by', as: 'createdRequests' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
    sequelize,
    User,
    Department,
    MaintenanceTeam,
    TeamMember,
    Equipment,
    MaintenanceRequest
};
