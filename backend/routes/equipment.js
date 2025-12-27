const express = require('express');
const router = express.Router();
const {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentRequests,
    getOpenRequestCount
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllEquipment);
router.get('/:id', protect, getEquipment);
router.post('/', protect, authorize('admin', 'manager'), createEquipment);
router.put('/:id', protect, authorize('admin', 'manager'), updateEquipment);
router.delete('/:id', protect, authorize('admin'), deleteEquipment);
router.get('/:id/requests', protect, getEquipmentRequests);
router.get('/:id/open-count', protect, getOpenRequestCount);

module.exports = router;
