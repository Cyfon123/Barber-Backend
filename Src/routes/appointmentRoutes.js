const express = require('express');
const router = express.Router();
const { validateAppointment } = require('../middleware/validation');
const {
  createAppointment,
  getAllAppointments,
  getAvailableSlots,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');

router.post('/', validateAppointment, createAppointment);
router.get('/', getAllAppointments);
router.get('/available-slots', getAvailableSlots);
router.patch('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;