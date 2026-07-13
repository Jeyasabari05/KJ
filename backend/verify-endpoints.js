const { spawn } = require('child_process');
const path = require('path');

// Port to run the test server on
const TEST_PORT = 6543;

console.log('----------------------------------------------------');
console.log('PhysioCare AI Kiosk Platform - Integration Test Suite');
console.log('----------------------------------------------------');

// Start the server process
const serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
    env: {
        ...process.env,
        PORT: TEST_PORT,
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USER: 'root',
        DB_PASS: 'sabari@21',
        DB_NAME: 'physiocare_tst_db',
        JWT_SECRET: 'testsecretkioskkey'
    }
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
    serverOutput += data.toString();
    // console.log('[Server stdout]:', data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
    console.error('[Server Error]:', data.toString());
});

// Wait for server to boot
setTimeout(async () => {
    console.log('Server process spun up successfully. Initializing API client tests...');

    if (serverOutput.includes('PhysioCare Kiosk Server is running')) {
        console.log('✓ Verified: Express bootstrap log received.');
    }

    let testsPassed = true;

    try {
        // Test 1: GET /api/health
        console.log('\nTesting GET /api/health...');
        const resHealth = await fetch(`http://localhost:${TEST_PORT}/api/health`);
        const healthData = await resHealth.json();
        if (resHealth.ok && healthData.status === 'Healthy') {
            console.log('✓ Test 1 Passed: Health endpoint healthy! Mode:', healthData.mode);
        } else {
            throw new Error(`Health endpoint returned status ${resHealth.status}`);
        }

        // Test 2: POST /api/auth/login
        console.log('\nTesting POST /api/auth/login...');
        const resLogin = await fetch(`http://localhost:${TEST_PORT}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'worker_selvi', password: 'password123', role: 'worker' })
        });
        const loginData = await resLogin.json();
        if (resLogin.ok && loginData.success) {
            console.log('✓ Test 2 Passed: Worker Authenticated successfully. Token received.');
        } else {
            throw new Error(`Login failed: ${loginData.error}`);
        }

        // Test 3: POST /api/patients
        console.log('\nTesting POST /api/patients...');
        const resPatient = await fetch(`http://localhost:${TEST_PORT}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Velmurugan S.',
                age: 62,
                gender: 'Male',
                village: 'Melagiri Tribal B',
                district: 'Krishnagiri',
                mobile: '9845612399',
                abhaId: 'AB-1010-2222-3333',
                emergencyContact: {
                    name: 'Selvi V.',
                    relationship: 'Spouse',
                    mobile: '9845612300'
                }
            })
        });
        const patientData = await resPatient.json();
        let patientId = '';
        if (resPatient.ok && patientData.success) {
            patientId = patientData.patient.patientId;
            console.log(`✓ Test 3 Passed: Patient registered! Assigned ID: ${patientId}`);
            console.log(`✓ Test 3 Passed: QR Code card generated successfully (length: ${patientData.patient.qrCodeUrl.length} chars)`);
        } else {
            throw new Error(`Patient registration failed: ${patientData.error}`);
        }

        // Test 4: GET /api/patients/:searchVal
        console.log(`\nTesting GET /api/patients/${patientId}...`);
        const resGetPatient = await fetch(`http://localhost:${TEST_PORT}/api/patients/${patientId}`);
        const rxPatient = await resGetPatient.json();
        if (resGetPatient.ok && rxPatient.patientId === patientId) {
            console.log(`✓ Test 4 Passed: Retrieved Patient successfully! Welcome, ${rxPatient.name}`);
        } else {
            throw new Error(`Failed to find patient profile: ${resGetPatient.status}`);
        }

        // Test 5: POST /api/assessments
        console.log('\nTesting POST /api/assessments...');
        const resAssess = await fetch(`http://localhost:${TEST_PORT}/api/assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId,
                healthScore: 78,
                painScore: 3,
                bmi: 24.2,
                mobility: 80,
                balance: 75,
                flexibility: 70,
                postureScores: { forwardHead: 35, roundedShoulders: 10, scoliosis: 5, kneeValgus: 15 },
                painQuestionnaire: { location: 'Knee OA', intensity: 3 },
                mentalHealthQuestionnaire: { phq9Score: 'No symptoms' },
                fallRiskStatus: 'Low'
            })
        });
        const assessData = await resAssess.json();
        if (resAssess.ok && assessData.success) {
            console.log('✓ Test 5 Passed: AI diagnostics assessment logged! Risk Category:', assessData.assessment.assessmentClass);
            console.log('✓ Test 5 Passed: Automated recommendations generated:', assessData.assessment.recommendations);
        } else {
            throw new Error(`Assessment logging failed: ${assessData.error}`);
        }

        // Test 6: GET /api/admin/metrics
        console.log('\nTesting GET /api/admin/metrics...');
        const resMetrics = await fetch(`http://localhost:${TEST_PORT}/api/admin/metrics`);
        const metricsData = await resMetrics.json();
        if (resMetrics.ok && metricsData.totalPatients > 0) {
            console.log(`✓ Test 6 Passed: Found total patient registers = ${metricsData.totalPatients}`);
            console.log(`✓ Test 6 Passed: District coverage details reported:`, metricsData.districtData.map(d => d.name).join(', '));
        } else {
            throw new Error(`Admin metrics endpoint failed: ${metricsData.error}`);
        }

    } catch (err) {
        testsPassed = false;
        console.error('\n❌ Integration Test Failed:', err.message);
    }

    // Teardown
    console.log('\n----------------------------------------');
    console.log('Tearing down active test nodes...');
    serverProcess.kill();

    if (testsPassed) {
        console.log('✨ SUCCESS: ALL API ENDPOINT TESTS CONCLUDED SUCCESSFULLY! ✨');
        process.exit(0);
    } else {
        console.log('❌ FAILURE: SOME INTEGRATION TESTS FAILED.');
        process.exit(1);
    }

}, 2500);
