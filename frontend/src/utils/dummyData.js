export const dummyStats = {
    totalRequests: 12,
    newRequests: 3,
    inProgressRequests: 5,
    totalEquipment: 8
};

export const dummyEquipment = [
    {
        _id: '1',
        name: 'CNC Milling Machine',
        serial_number: 'CNC-2023-001',
        category: 'Heavy Machinery',
        status: 'active',
        location: 'Shop Floor A',
        department: { name: 'Production' },
        maintenance_team: { team_name: 'Team Alpha' },
        assigned_employee: { name: 'John Doe' }
    },
    {
        _id: '2',
        name: 'Hydraulic Press',
        serial_number: 'HP-2022-055',
        category: 'Heavy Machinery',
        status: 'maintenance',
        location: 'Shop Floor B',
        department: { name: 'Production' },
        maintenance_team: { team_name: 'Team Beta' },
        assigned_employee: { name: 'Jane Smith' }
    },
    {
        _id: '3',
        name: '3D Printer X1',
        serial_number: '3DP-2024-X1',
        category: 'Electronics',
        status: 'active',
        location: 'Lab 1',
        department: { name: 'R&D' },
        maintenance_team: { team_name: 'Tech Squad' },
        assigned_employee: { name: 'Mike Ross' }
    },
    {
        _id: '4',
        name: 'Conveyor Belt System',
        serial_number: 'CBS-2021-100',
        category: 'Transport',
        status: 'scrapped',
        location: 'Warehouse',
        department: { name: 'Logistics' },
        maintenance_team: { team_name: 'Team Alpha' },
        assigned_employee: { name: 'Sarah Connor' }
    }
];

export const dummyRequests = [
    {
        _id: '101',
        subject: 'CNC Machine Overheating',
        description: 'The CNC machine is shutting down due to high temperature errors.',
        priority: 'high',
        stage: 'new',
        type: 'corrective',
        equipment: { name: 'CNC Milling Machine' },
        assigned_technician: { name: 'Bob Builder' },
        created_at: new Date().toISOString()
    },
    {
        _id: '102',
        subject: 'Monthly Maintenance: Hydraulic Press',
        description: 'Routine oil check and pressure calibration.',
        priority: 'medium',
        stage: 'in-progress',
        type: 'preventive',
        equipment: { name: 'Hydraulic Press' },
        assigned_technician: { name: 'Alice Engineer' },
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: '103',
        subject: 'Conveyor Belt Stuck',
        description: 'Belt is jammed at section 4.',
        priority: 'high',
        stage: 'in-progress',
        type: 'corrective',
        equipment: { name: 'Conveyor Belt System' },
        assigned_technician: { name: 'Charlie Technician' },
        created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        _id: '104',
        subject: 'Broken Screen on 3D Printer',
        description: 'Touch interface not responding.',
        priority: 'low',
        stage: 'new',
        type: 'corrective',
        equipment: { name: '3D Printer X1' },
        assigned_technician: null,
        created_at: new Date().toISOString()
    },
    {
        _id: '105',
        subject: 'Compressor Filter Replacement',
        description: 'Change air filters.',
        priority: 'medium',
        stage: 'repaired',
        type: 'preventive',
        equipment: { name: 'Industrial Compressor' },
        assigned_technician: { name: 'Dave Mechanic' },
        created_at: new Date(Date.now() - 604800000).toISOString()
    }
];

export const dummyCalendarRequests = [
    {
        _id: '201',
        subject: 'Quarterly Safety Inspection',
        description: 'Inspect all safety guards.',
        equipment: { name: 'All Machinery' },
        scheduled_date: new Date().toISOString(),
        priority: 'high'
    },
    {
        _id: '202',
        subject: 'Oil Change - Generator',
        description: 'Regular oil change.',
        equipment: { name: 'Backup Generator' },
        scheduled_date: new Date(Date.now() + 86400000).toISOString(),
        priority: 'medium'
    },
    {
        _id: '203',
        subject: 'Software Update - CNC',
        description: 'Update firmware to v2.0.',
        equipment: { name: 'CNC Milling Machine' },
        scheduled_date: new Date(Date.now() + 172800000).toISOString(),
        priority: 'low'
    },
    {
        _id: '204',
        subject: 'Belt Inspection',
        description: 'Check tension and wear.',
        equipment: { name: 'Conveyor Belt System' },
        scheduled_date: new Date(Date.now() - 86400000).toISOString(),
        priority: 'medium'
    }
];

export const dummyRecentActivity = [
    {
        id: 1,
        user: 'John Doe',
        action: 'created a new request',
        target: 'CNC Machine Overheating',
        time: '2 hours ago',
        type: 'create'
    },
    {
        id: 2,
        user: 'Alice Engineer',
        action: 'completed maintenance',
        target: 'Hydraulic Press',
        time: '5 hours ago',
        type: 'complete'
    },
    {
        id: 3,
        user: 'System',
        action: 'alert',
        target: 'Server high load',
        time: '1 day ago',
        type: 'alert'
    },
    {
        id: 4,
        user: 'Mike Ross',
        action: 'updated status',
        target: '3D Printer X1',
        time: '1 day ago',
        type: 'update'
    }
];
