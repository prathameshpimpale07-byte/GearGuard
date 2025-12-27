// Role constants
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    TECHNICIAN: 'technician',
    EMPLOYEE: 'employee'
};

// Request stages
export const REQUEST_STAGES = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    REPAIRED: 'repaired',
    SCRAP: 'scrap'
};

// Request types
export const REQUEST_TYPES = {
    CORRECTIVE: 'corrective',
    PREVENTIVE: 'preventive'
};

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Stage display names
export const STAGE_LABELS = {
    new: 'New',
    in_progress: 'In Progress',
    repaired: 'Repaired',
    scrap: 'Scrap'
};

// Stage colors
export const STAGE_COLORS = {
    new: '#3b82f6',
    in_progress: '#f59e0b',
    repaired: '#10b981',
    scrap: '#ef4444'
};

// Type labels
export const TYPE_LABELS = {
    corrective: 'Corrective',
    preventive: 'Preventive'
};
