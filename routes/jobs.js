import express from 'express';
import axios from 'axios';
const app=express();
const router = express.Router();
const baseUrl = 'https://remotive.io/api/remote-jobs/';

// Route for posting a job
router.post('/post', async (req, res) => {
    try {
        const response = await axios.post(`${baseUrl}jobs`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'X-ApiClientId': 'YOUR_CLIENT_ID', // Replace with your actual client ID
                'X-ApiSignature': 'YOUR_SIGNATURE', // Replace with your actual signature
                'X-TimeStamp': new Date().toISOString(),
            },
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route for editing a job
router.put('/edit/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const response = await axios.put(`${baseUrl}jobs/${jobId}`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'X-ApiClientId': 'YOUR_CLIENT_ID', // Replace with your actual client ID
                'X-ApiSignature': 'YOUR_SIGNATURE', // Replace with your actual signature
                'X-TimeStamp': new Date().toISOString(),
            },
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route for uploading a resume
router.post('/upload-resume', async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('resume', req.files.resume.data);

        const response = await axios.post(`${baseUrl}resumes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-ApiClientId': 'YOUR_CLIENT_ID', // Replace with your actual client ID
                'X-ApiSignature': 'YOUR_SIGNATURE', // Replace with your actual signature
                'X-TimeStamp': new Date().toISOString(),
            },
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route for relisting a job
router.post('/relist/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const response = await axios.post(`${baseUrl}jobs/${jobId}/relist`, null, {
            headers: {
                'Content-Type': 'application/json',
                'X-ApiClientId': 'YOUR_CLIENT_ID', // Replace with your actual client ID
                'X-ApiSignature': 'YOUR_SIGNATURE', // Replace with your actual signature
                'X-TimeStamp': new Date().toISOString(),
            },
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

export default router;
