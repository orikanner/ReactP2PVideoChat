const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    amount: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    consumedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;



