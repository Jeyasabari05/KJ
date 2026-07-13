require('dotenv').config();
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { initializeDatabase, getSequelize } = require('./config/db');
const Patient = require('./models/Patient');
const Assessment = require('./models/Assessment');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');
const ActivityLog = require('./models/ActivityLog');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretgovtokenkeyphysiocare';

// Middleware
app.use(cors());
app.use(express.json());

const defaultDoctors = [
    { doctorId: 'DOC-TN-001', name: 'Dr. R. Anbarasan', specialty: 'Physiotherapist & Rehab Specialist', district: 'Dharmapuri', mobile: '9123456780', email: 'anbarasan@health.tn.gov.in', status: 'Active', availability: [] },
    { doctorId: 'DOC-TN-002', name: 'Dr. S. Meenakshi', specialty: 'Neurological Rehabilitation', district: 'Madurai', mobile: '9123456781', email: 'meenakshi@health.tn.gov.in', status: 'Active', availability: [] },
    { doctorId: 'DOC-TN-003', name: 'Dr. K. Saravanan', specialty: 'Pediatric Physiotherapy', district: 'Salem', mobile: '9123456782', email: 'saravanan@health.tn.gov.in', status: 'Active', availability: [] }
];

let dbInitialized = false;

// Initialize Database & sync
initializeDatabase()
    .then(async (sequelize) => {
        // Sync models
        await sequelize.sync();
        console.log('SQL Database models synchronized successfully.');
        dbInitialized = true;

        // Seed initial doctors if DB empty
        try {
            const count = await Doctor.count();
            if (count === 0) {
                await Doctor.bulkCreate(defaultDoctors);
                console.log('Pre-populated default doctors into MySQL');
            }
        } catch (err) {
            console.error('Error seeding doctors:', err);
        }
    })
    .catch(err => {
        console.error('CRITICAL: MySQL Database initialization failed!', err.message);
    });

// Helper to log activities
async function logActivity(action, details, operator = 'Health Worker') {
    const logData = {
        kioskId: 'KIOSK-TN-01',
        action,
        details,
        operator,
        deviceHealth: {
            cpuUsage: Math.floor(Math.random() * 20) + 10,
            memUsage: Math.floor(Math.random() * 30) + 20,
            cameraStatus: 'Online',
            networkLatency: Math.floor(Math.random() * 15) + 15
        }
    };

    if (dbInitialized) {
        try {
            await ActivityLog.create(logData);
        } catch (e) {
            console.error('Activity logging failed', e);
        }
    } else {
        console.log('Skipped activity log (DB not ready):', action, details);
    }
}

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Healthy',
        timestamp: new Date(),
        mode: dbInitialized ? 'MYSQL_CONNECTED' : 'MYSQL_INITIALIZING',
        kioskId: 'KIOSK-TN-01',
        phc: 'Melagiri Tribal PHC, Krishnagiri District'
    });
});

// Authentication System
app.post('/api/auth/login', async (req, res) => {
    const { username, password, role } = req.body;

    const validRoles = ['patient', 'doctor', 'worker', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid portal role.' });
    }

    // Create simple access token
    const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '8h' });
    await logActivity('USER_LOGIN', `Logged in as ${role}: ${username}`, username);

    res.json({
        success: true,
        token,
        role,
        user: {
            username,
            name: role === 'doctor' ? 'Dr. S. Meenakshi' : (role === 'admin' ? 'Kiosk Administrator' : (role === 'worker' ? 'ANM Worker Selvi' : 'Citizen Patient')),
            district: 'Krishnagiri'
        }
    });
});

// Patients APIs
app.post('/api/patients', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(503).json({ error: 'Database is still initializing' });
        }
        const data = req.body;

        // Automatically generate distinct Patient ID in TN Government Kiosk format
        const count = await Patient.count();
        const sequence = String(count + 1).padStart(4, '0');
        const districtPrefix = data.district ? data.district.substring(0, 3).toUpperCase() : 'MDU';
        const patientId = `TN-PHC-${districtPrefix}-${new Date().getFullYear()}-${sequence}`;

        // Generate QR Code containing patient record metadata for easy offline scanners
        const qrPayload = JSON.stringify({
            id: patientId,
            n: data.name,
            abha: data.abhaId,
            d: data.district,
            v: data.village
        });
        const qrCodeUrl = await QRCode.toDataURL(qrPayload);

        const patientRecord = {
            ...data,
            patientId,
            qrCodeUrl
        };

        const dbPatient = await Patient.create(patientRecord);
        await logActivity('PATIENT_REGISTRATION', `Registered Patient ${patientId} (${data.name})`);

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            patient: dbPatient
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Patient registration failed: ' + err.message });
    }
});

// Get all Patients
app.get('/api/patients', async (req, res) => {
    try {
        if (!dbInitialized) return res.json([]);
        const list = await Patient.findAll({ order: [['createdAt', 'DESC']] });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Patient by ID or ID search (also QR Login resolver)
app.get('/api/patients/:searchVal', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(404).json({ error: 'Database not ready' });
        }
        const searchVal = req.params.searchVal;

        const found = await Patient.findOne({
            where: {
                [Op.or]: [
                    { patientId: searchVal },
                    { abhaId: searchVal },
                    { mobile: searchVal }
                ]
            }
        });

        if (!found) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(found);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Health Assessment Endpoints
app.post('/api/assessments', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(503).json({ error: 'Database not ready' });
        }
        const data = req.body;

        // Automatically generate AI suggestions if empty
        let recommendations = data.recommendations || [];
        if (recommendations.length === 0) {
            if (data.healthScore < 50) {
                recommendations.push('Immediate referral to Sub-District Hospital Physiotherapist');
                recommendations.push('Daily supervised neck/spine stability exercises');
                recommendations.push('Avoid sudden bending or lifting moderate weights');
            } else if (data.healthScore < 75) {
                recommendations.push('Perform active range of motion exercises 2x daily');
                recommendations.push('Follow-up teleconsultation scheduled in 2 weeks');
                recommendations.push('Posture corrections for forward head angle');
            } else {
                recommendations.push('Maintain active daily walking');
                recommendations.push('General spinal posture alignment maintenance exercises');
            }
        }

        // Assign appropriate risk class based on health score
        let assessmentClass = 'Good';
        if (data.healthScore >= 85) assessmentClass = 'Excellent';
        else if (data.healthScore >= 70) assessmentClass = 'Good';
        else if (data.healthScore >= 55) assessmentClass = 'Moderate';
        else if (data.healthScore >= 35) assessmentClass = 'High Risk';
        else assessmentClass = 'Critical';

        const assessmentRecord = {
            ...data,
            assessmentClass,
            recommendations
        };

        const dbAssessment = await Assessment.create(assessmentRecord);
        await logActivity('AI_ASSESSMENT', `Completed assessment for ${data.patientId} - Score: ${data.healthScore}%`);

        res.status(201).json({
            success: true,
            assessment: dbAssessment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch Assessments for a Patient
app.get('/api/assessments/:patientId', async (req, res) => {
    try {
        if (!dbInitialized) return res.json([]);
        const { patientId } = req.params;
        const list = await Assessment.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Telemedicine/Appointment scheduling
app.post('/api/appointments', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(503).json({ error: 'Database not ready' });
        }
        const data = req.body;
        const appRecord = {
            ...data,
            videoRoomId: `ROOM-${data.patientId.replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
            status: 'Scheduled'
        };

        const dbApp = await Appointment.create(appRecord);
        await logActivity('APPOINTMENT_BOOKED', `Booked teleconsultation for ${data.patientName} with ${data.doctorName}`);

        res.status(201).json({
            success: true,
            appointment: dbApp
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get appointments (with option to filter by doctor or patient)
app.get('/api/appointments', async (req, res) => {
    try {
        if (!dbInitialized) return res.json([]);
        const { patientId, doctorId } = req.query;

        const filter = {};
        if (patientId) filter.patientId = patientId;
        if (doctorId) filter.doctorId = doctorId;

        const list = await Appointment.findAll({
            where: filter,
            order: [['createdAt', 'DESC']]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update appointment prescription or status (e.g. Completed)
app.put('/api/appointments/:id', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(503).json({ error: 'Database not ready' });
        }
        const { id } = req.params;
        const { status, prescription, notes } = req.body;

        const isNum = /^\d+$/.test(id);
        const updated = await Appointment.findOne({
            where: {
                [Op.or]: isNum ? [{ id: parseInt(id) }, { videoRoomId: id }] : [{ videoRoomId: id }]
            }
        });

        if (!updated) return res.status(404).json({ error: 'Appointment not found' });

        await updated.update({ status, prescription, notes });
        await logActivity('CONSULTATION_COMPLETED', `Prescription generated for ${updated.patientId}`);
        res.json({ success: true, appointment: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Doctors
app.get('/api/doctors', async (req, res) => {
    try {
        if (!dbInitialized) return res.json([]);
        const list = await Doctor.findAll();
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin analytics dashboard aggregation
app.get('/api/admin/metrics', async (req, res) => {
    try {
        if (!dbInitialized) {
            return res.status(503).json({ error: 'Database not ready' });
        }

        const pts = await Patient.findAll();
        const totalAssessments = await Assessment.count();
        const totalDoctors = await Doctor.count();

        // Count districts and villages represented
        const districtsSet = new Set(pts.map(p => p.district));
        const villagesSet = new Set(pts.map(p => p.village));

        const logs = await ActivityLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.json({
            totalPatients: pts.length,
            totalDoctors,
            totalAssessments,
            districtsCovered: districtsSet.size || 1,
            villagesCovered: villagesSet.size || 1,
            kioskId: 'KIOSK-TN-01',
            deviceHealth: {
                cpuUsage: 14,
                memUsage: 38,
                cameraStatus: 'Online',
                networkLatency: 22
            },
            districtData: [
                { name: 'Krishnagiri', patients: 124, screening: 95 },
                { name: 'Dharmapuri', patients: 86, screening: 70 },
                { name: 'Salem', patients: 95, screening: 82 },
                { name: 'Madurai', patients: 64, screening: 55 },
                { name: 'Tiruvannamalai', patients: 112, screening: 98 },
                { name: 'Nilgiris (Tribal)', patients: 45, screening: 40 }
            ],
            diseaseDistribution: [
                { name: 'Neck Pain', value: 35 },
                { name: 'Back Spine Pain', value: 40 },
                { name: 'Frozen Shoulder', value: 25 },
                { name: 'Osteoarthritis Knee', value: 48 },
                { name: 'Stroke Rehab', value: 15 },
                { name: 'Falls Risk Elderly', value: 20 }
            ],
            recentActivityLogs: logs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root Page
app.get('/', (req, res) => {
    res.send('<h1>PhysioCare Tamil Nadu PHC Healthcare platform is running.</h1>');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhysioCare Kiosk Server is running on port ${PORT}`);
});
