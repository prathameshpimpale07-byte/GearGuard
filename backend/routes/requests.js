const express = require('express');
const router = express.Router();
const {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    changeStage,
    getCalendarRequests,
    getOverdueRequests,
    deleteRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

// Special routes first (before :id routes)
router.get('/calendar', protect, getCalendarRequests);
router.get('/overdue', protect, getOverdueRequests);

// Regular CRUD routes
router.get('/', protect, getAllRequests);
router.get('/:id', protect, getRequest);
router.post('/', protect, createRequest);
router.put('/:id', protect, updateRequest);
router.put('/:id/stage', protect, changeStage);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteRequest);

module.exports = router;
