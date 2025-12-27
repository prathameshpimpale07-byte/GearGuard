const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getTechnicians
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Special routes first
router.get('/technicians', protect, getTechnicians);

// Regular CRUD routes
router.get('/', protect, authorize('admin', 'manager'), getAllUsers);
router.get('/:id', protect, getUser);
router.post('/', protect, authorize('admin'), createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
