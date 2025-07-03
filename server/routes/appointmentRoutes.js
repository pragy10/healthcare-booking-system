const express = require('express');
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// General routes
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);

// Patient routes
router.post('/', authorize('patient'), createAppointment);
router.get('/patient/my-appointments', authorize('patient'), getPatientAppointments);

// Doctor routes
router.get('/doctor/my-appointments', authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', authorize('doctor'), updateAppointmentStatus);

module.exports = router;
