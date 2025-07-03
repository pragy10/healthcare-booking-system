const express = require('express');
const {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorProfile
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes - Doctor only
router.use(protect);
router.post('/profile', authorize('doctor'), createDoctorProfile);
router.get('/profile', authorize('doctor'), getDoctorProfile);
router.put('/profile', authorize('doctor'), updateDoctorProfile);

module.exports = router;
