const Certificate = require('../models/Certificate');

const getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ learner: req.user._id })
            .populate('course', 'title')
            .populate('learner', 'name email')
            .sort('-issuedAt');

        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('course', 'title description')
            .populate('learner', 'name email');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyCertificates,
    getCertificate,
};
