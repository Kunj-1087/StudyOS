const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const API_URL = 'http://localhost:3000';
const jar = new CookieJar();
const client = wrapper(axios.create({
    baseURL: API_URL,
    jar,
    withCredentials: true
}));

const randomString = () => Math.random().toString(36).substring(7);
const email = `smoke_${randomString()}@test.com`;
const password = 'password123';

async function runSmokeTest() {
    console.log('🔥 Starting Smoke Test...');

    try {
        // 1. Health Check
        console.log('1️⃣  Checking Health...');
        const health = await client.get('/health');
        if (health.status === 200 && health.data.status === 'UP') {
            console.log('✅ Health UP');
        } else {
            throw new Error(`Health Check Failed: ${health.status}`);
        }

        // 2. Register User (Auth Flow)
        console.log(`2️⃣  Registering User (${email})...`);
        const regRes = await client.post('/api/auth/register', {
            email,
            password,
            name: 'Smoke Tester'
        });
        if (regRes.status === 201 && regRes.data.success) {
            console.log('✅ Registered & Logged In');
        } else {
            throw new Error('Registration Failed');
        }

        // 3. Create Subject
        console.log('3️⃣  Creating Subject...');
        const createRes = await client.post('/api/subjects', {
            name: 'Smoke Subject',
            color: '#FF0000'
        });
        if (createRes.status === 201 && createRes.data.data.name === 'Smoke Subject') {
            console.log('✅ Subject Created');
        } else {
            throw new Error('Create Subject Failed');
        }
        const subjectId = createRes.data.data.id;

        // 4. List Subjects
        console.log('4️⃣  Listing Subjects...');
        const listRes = await client.get('/api/subjects');
        // We expect at least 2 subjects (Default 'General' + 'Smoke Subject')
        if (listRes.status === 200 && listRes.data.data.length >= 2) {
            console.log(`✅ Listed ${listRes.data.data.length} Subjects`);
        } else {
            throw new Error('List Subjects Failed');
        }

        // 5. Update Subject
        console.log('5️⃣  Updating Subject...');
        const updateRes = await client.patch(`/api/subjects/${subjectId}`, {
            name: 'Updated Smoke Subject'
        });
        if (updateRes.status === 200 && updateRes.data.data.name === 'Updated Smoke Subject') {
            console.log('✅ Subject Updated');
        } else {
            throw new Error('Update Subject Failed');
        }

        // 6. Delete Subject
        console.log('6️⃣  Deleting Subject...');
        const delRes = await client.delete(`/api/subjects/${subjectId}`);
        if (delRes.status === 200) {
            console.log('✅ Subject Deleted');
        } else {
            throw new Error('Delete Subject Failed');
        }

        console.log('🎉 Smoke Test PASSED!');

    } catch (error) {
        console.error('❌ Smoke Test FAILED');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runSmokeTest();
