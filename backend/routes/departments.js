const express = require('express');
const router = express.Router();
const {
    getAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllDepartments);
router.get('/:id', protect, getDepartment);
router.post('/', protect, authorize('admin', 'manager'), createDepartment);
router.put('/:id', protect, authorize('admin', 'manager'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
