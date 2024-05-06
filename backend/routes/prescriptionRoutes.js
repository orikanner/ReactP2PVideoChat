const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, authMiddleware.vetCheck, prescriptionController.createPrescription);
router.get('/', authMiddleware.verifyToken, prescriptionController.getPrescriptions);

module.exports = router;
