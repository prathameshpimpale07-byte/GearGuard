import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './CreateEquipment.css';

const CreateEquipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        category: '',
        location: '',
        department: '',
        maintenance_team: '',
        assigned_employee: '',
        purchase_date: '',
        warranty_expiry: ''
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [deptsRes, teamsRes, usersRes] = await Promise.all([
                api.get('/departments'),
                api.get('/teams'),
                api.get('/users')
            ]);
            setDepartments(deptsRes.data.data || []);
            setTeams(teamsRes.data.data || []);
            setEmployees(usersRes.data.data?.filter(u => u.role === 'employee') || []);
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/equipment', formData);
            navigate(`/equipment/${response.data.data._id}`);
        } catch (err) {
            alert('Failed to create equipment. Please check all fields.');
            console.error('Error creating equipment:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-equipment-page">
            <div className="page-header">
                <h1>Add New Equipment</h1>
                <p className="page-subtitle">Register new machinery or asset</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="equipment-form">
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Equipment Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., CNC Milling Machine"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="serial_number">Serial Number *</label>
                                <input
                                    type="text"
                                    id="serial_number"
                                    name="serial_number"
                                    value={formData.serial_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., CNC-2024-001"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category *</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Machinery, Electrical, HVAC"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location *</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Production Floor - Zone A1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Assignment</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="department">Department *</label>
                                <select
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maintenance_team">Maintenance Team *</label>
                                <select
                                    id="maintenance_team"
                                    name="maintenance_team"
                                    value={formData.maintenance_team}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team._id}>
                                            {team.team_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="assigned_employee">Assigned Employee (Optional)</label>
                                <select
                                    id="assigned_employee"
                                    name="assigned_employee"
                                    value={formData.assigned_employee}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Warranty Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="purchase_date">Purchase Date *</label>
                                <input
                                    type="date"
                                    id="purchase_date"
                                    name="purchase_date"
                                    value={formData.purchase_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="warranty_expiry">Warranty Expiry *</label>
                                <input
                                    type="date"
                                    id="warranty_expiry"
                                    name="warranty_expiry"
                                    value={formData.warranty_expiry}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/equipment')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Equipment'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateEquipment;
