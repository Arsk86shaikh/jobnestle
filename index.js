import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const users = {};

// Utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Function to fetch jobs
const fetchJobs = async () => {
    try {
        const response = await axios.get('https://remotive.io/api/remote-jobs');
        return response.data.jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

// Authentication helpers
async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = hashedPassword;
}

async function authenticateUser(email, password) {
    const hashedPassword = users[email];
    if (!hashedPassword) return false;
    return bcrypt.compare(password, hashedPassword);
}

// Routes
app.get('/', async (req, res) => {
    const jobs = await fetchJobs();
    res.render('index', { jobs });
});

app.get('/jobs/:id', async (req, res) => {
    try {
        // Extract and convert the jobId
        const jobId = parseInt(req.params.id, 10);

        // Fetch jobs
        const jobs = await fetchJobs();

        // Find the job by ID
        const job = jobs.find(j => j.id === jobId);

        if (job) {
            // Render the jobDetails.ejs with the job data
            res.render('job', { job });
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: 'An error occurred while fetching the job.' });
    }
});
app.get('/post', (req, res) => {
    // Render the job posting form
    res.render('jobs');  // Assuming your EJS template is named 'postJob.ejs'
});



app.post('/post', async (req, res) => {
    try {
        // Get form data from the request body
        const { jobTitle, jobDescription, companyName } = req.body;

        // You would typically save this data to a database, for example:
        const newJob = {
            title: jobTitle,
            description: jobDescription,
            company_name: companyName
        };

        // Save the job to the database or in-memory storage (this is just an example)
        // For example: await Job.create(newJob);
        
        console.log('New job posted:', newJob);  // Replace with actual database saving logic

        // Redirect to a confirmation page or back to the job listings
        res.redirect('/jobs');  // Redirect to the job listings page after successful posting
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).send('An error occurred while posting the job.');
    }
});


app.get('/relist', (req, res) => {
    res.render('relist_job');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (await authenticateUser(email, password)) {
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (users[email]) {
        res.status(400).send('User already exists');
    } else {
        await createUser(email, password);
        res.redirect('/login');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
