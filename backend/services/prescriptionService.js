const Prescription = require('../models/prescription');

const addPrescription = async ({ name, amount, consumedBy }, createdBy) => {
    try {
        const prescription = await Prescription.create({ name, amount, createdBy, consumedBy });
        return { status: 201, data: { message: 'Prescription created successfully', prescriptionId: prescription.id } };
    } catch (error) {
        return { status: 500, data: { message: 'Error creating prescription' } };
    }
};

const getAllPrescriptions = async () => {
    try {
        const prescriptions = await Prescription.find().populate('createdBy consumedBy', 'name');
        return { status: 200, data: { prescriptions } };
    } catch (error) {
        return { status: 500, data: { message: 'Error fetching prescriptions' } };
    }
};

module.exports = { addPrescription, getAllPrescriptions };
