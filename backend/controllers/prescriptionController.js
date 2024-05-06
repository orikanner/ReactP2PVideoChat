const prescriptionService = require('../services/prescriptionService');

const createPrescription = async (req, res) => {
    const result = await prescriptionService.addPrescription(req.body, req.user.id);
    res.status(result.status).json(result.data);
};

const getPrescriptions = async (req, res) => {
    const result = await prescriptionService.getAllPrescriptions();
    res.status(result.status).json(result.data);
};

module.exports = { createPrescription, getPrescriptions };
