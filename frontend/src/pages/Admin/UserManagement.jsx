import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || []);
        } catch (err) {
            setError('Failed to load users.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user.');
            console.error('Error deleting user:', err);
        }
    };

    const filteredUsers = users.filter(user =>
        filterRole === 'all' || user.role === filterRole
    );

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { class: 'role-admin', label: 'Admin' },
            manager: { class: 'role-manager', label: 'Manager' },
            technician: { class: 'role-technician', label: 'Technician' },
            employee: { class: 'role-employee', label: 'Employee' }
        };
        const config = roleConfig[role] || roleConfig.employee;
        return <span className={`role-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return <div className="loading-container">Loading users...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="user-management-page">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p className="page-subtitle">Manage system users and their roles</p>
                </div>
                <Link to="/users/create" className="btn btn-primary">
                    ➕ Create User
                </Link>
            </div>

            <Card className="filters-card">
                <div className="filters-container">
                    <div className="filter-group">
                        <label>Filter by Role:</label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="technician">Technician</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                    <div className="stats">
                        <span>Total Users: <strong>{users.length}</strong></span>
                        <span>Showing: <strong>{filteredUsers.length}</strong></span>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <span className="user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>
                                        <span className={`status-badge status-${user.status || 'active'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/users/${user._id}/edit`}
                                                className="btn-icon btn-edit"
                                                title="Edit"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="btn-icon btn-delete"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
