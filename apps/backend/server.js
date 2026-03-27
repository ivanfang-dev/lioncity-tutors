import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { Assignment, Tutor } from '../../packages/shared/server-exports.js';
import { normalizePhone, generatePhoneVariations } from '../../packages/shared/utils/phoneUtils.js';


// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;



app.use(helmet());

// 2. Security Best Practice: Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', 
    'https://www.lioncitytutors.com',
    'https://lioncitytutors.com',
    'http://www.lioncitytutors.com',
    'http://lioncitytutors.com'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'], // Specify allowed headers
  credentials: true
}));

app.use(express.json());

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));


const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  level: { type: String, required: true },
  location: { type: String },
  
  // Lesson details
  lessonDuration: { type: String, default: "1.5 Hours" },
  customDuration: { type: String },
  lessonFrequency: { type: String, default: "1 Lesson/Week" },
  customFrequency: { type: String },
  preferredTime: { type: String },
  
  // Tutor preferences
  tutorType: {
    partTime: { type: Boolean, default: false },
    fullTime: { type: Boolean, default: false },
    moeTeacher: { type: Boolean, default: false }
  },
  
  // Budget information
  budget: {
    marketRate: { type: Boolean, default: true },
    custom: { type: Boolean, default: false },
    customAmount: { type: String }
  },
  
  // Additional preferences
  preferences: { type: String }
}, { timestamps: true }); // timestamps will auto add createdAt and updatedAt fields


const Contact = mongoose.model('Contact', contactSchema);

// New schema for test paper leads
const testPaperLeadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  downloads: [{
    subject: String,        
    level: String, 
    paperTitle: String,
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const TestPaperLead = mongoose.model('TestPaperLead', testPaperLeadSchema);

// --- API ROUTES ---

// Root route
app.get('/', (req, res) => {
  res.send('Contact form API is running');
});

// Email tester route
app.get('/email-tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'email-tester.html'));
});

app.get("/keep-alive", (req, res) => {
  res.status(200).send("Backend is awake");
});

// Contact form endpoint
app.post('/api/requestfortutor', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(200).json({ success: true, message: 'Form submitted and saved successfully!' });
  } catch (err) {
    console.error('Error saving form:', err);
    res.status(500).json({ success: false, error: 'Failed to save form submission.' });
  }
});


app.post('/api/registerfortutor', async (req, res) => {
  try {
    if (req.body.contactNumber) {
      req.body.contactNumber = req.body.contactNumber.replace(/[\s\-\+]/g, '').replace(/^65/, '');
    }
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase().trim();
    }

    const newTutor = new Tutor(req.body);
    await newTutor.save();
    res.status(200).json({ message: 'Tutor registration saved successfully!' });
  } catch (err) {
    console.error('Failed to save tutor registration:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A tutor with this email or contact number already exists.' });
    }
    res.status(500).json({ error: 'Failed to register tutor.' });
  }
});

/**
 * @route   POST /api/tutors/verify
 * @desc    Verifies if a tutor exists using email or contact number
 * @access  Public
 */
app.post('/api/tutors/verify', async (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: 'Identifier (email or contact number) is required.' });
  }

  const sanitizedIdentifier = identifier.toLowerCase().trim();
  const phoneRegex = /^[89]\d{7}$/;
  const normalizedPhone = normalizePhone(identifier);

  try {
    let query;
    
    if (phoneRegex.test(normalizedPhone)) {
      // It's a phone number - search using all variations
      const phoneVariations = generatePhoneVariations(identifier);
      query = {
        $or: [
          { email: sanitizedIdentifier },
          { contactNumber: { $in: phoneVariations } }
        ]
      };
    } else {
      // It's an email
      query = { email: sanitizedIdentifier };
    }

    const tutor = await Tutor.findOne(query).select('_id fullName').lean();

    if (tutor) {
      res.json({
        exists: true,
        tutor: {
          id: tutor._id,
          fullName: tutor.fullName,
        },
      });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error verifying tutor:', err);
    res.status(500).json({ error: 'An error occurred during verification.' });
  }
});

/**
 * @route   POST /api/assignments/apply
 * @desc    Submits an application for assignments on behalf of a tutor
 * @access  Public (Relies on verified tutorId)
 */
app.post('/api/assignments/apply', async (req, res) => {
  const { assignmentIds, tutorId, rates } = req.body;

  if (!Array.isArray(assignmentIds) || assignmentIds.length === 0 || !tutorId) {
    return res.status(400).json({ error: 'Missing assignment IDs or tutor ID.' });
  }

  // Validate rates if provided
  if (rates && typeof rates !== 'object') {
    return res.status(400).json({ error: 'Rates must be an object mapping assignment IDs to rate values.' });
  }

  try {
    const tutor = await Tutor.findById(tutorId).lean();
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor profile not found.' });
    }

    let successCount = 0;
    const errors = [];

    for (const assignmentId of assignmentIds) {
      try {
        const existingApplication = await Assignment.findOne({
          _id: assignmentId,
          'applicants.tutorId': tutor._id
        });

        if (existingApplication) {
          continue; 
        }

        const newApplicant = {
          tutorId: tutor._id,
          status: 'Pending',
          appliedAt: new Date(),
          contactDetails: tutor.contactNumber || 'N/A',
          notes: `Applied via website by ${tutor.fullName}`,
          rate: rates && rates[assignmentId] ? rates[assignmentId] : null
        };

        // Update the assignment
        const result = await Assignment.updateOne(
          { 
            _id: assignmentId,
            'applicants.tutorId': { $ne: tutor._id } // Double-check to prevent duplicates
          },
          { 
            $push: { applicants: newApplicant }
          }
        );

        if (result.modifiedCount > 0) {
          successCount++;
          console.log(`✅ Successfully applied to assignment ${assignmentId} with rate: ${newApplicant.rate}`);
        } else {
          console.log(`⚠️ No modification for assignment ${assignmentId} - may already be applied`);
        }
      } catch (assignmentError) {
        console.error(`Error applying to assignment ${assignmentId}:`, assignmentError);
        errors.push(`Failed to apply to assignment ${assignmentId}`);
      }
    }

    if (successCount > 0) {
      res.status(200).json({ 
        success: true, 
        message: `Successfully applied to ${successCount} new assignment(s).`,
        appliedCount: successCount,
        errors: errors.length > 0 ? errors : undefined
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: 'You have already applied for the selected assignment(s).',
        appliedCount: 0
      });
    }

  } catch (err) {
    console.error('Error applying for assignments:', err);
    res.status(500).json({ error: 'An error occurred while submitting your application.' });
  }
});

// Test paper leads endpoint
app.post('/api/test-paper-leads', async (req, res) => {
  try {
    const { email, phone, subject, level, paperTitle} = req.body;
    
    // Find existing lead or create new one
    let lead = await TestPaperLead.findOne({ email });
    const newDownload = { level, subject, paperTitle };

    if (lead) {
      // Add new download to existing lead
      lead.downloads.push(newDownload);
      await lead.save();
    } else {
      // Create new lead
      lead = new TestPaperLead({
        email,
        phone,
        downloads: [newDownload]
      });
      await lead.save();
    }
    
    res.status(200).json({ success: true, message: 'Download tracked successfully!' });
  } catch (err) {
    console.error('Error tracking download:', err);
    res.status(500).json({ success: false, error: 'Failed to track download.' });
  }
});

app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment
      .find({ status: 'Open' }) // Only fetch open assignments
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('title level subject location frequency rate description status createdAt _id') // Include status field
      .lean(); // Use lean() for better performance
    
    res.status(200).json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

app.get('/api/analytics/popular-papers', async (req, res) => {
  try {
    const leads = await TestPaperLead.find({});
    
    // Count downloads by subject, level, year
    const analytics = {};
    
    leads.forEach(lead => {
      lead.downloads.forEach(download => {
        const key = `${download.level}-${download.subject}-${download.year}`;
        analytics[key] = (analytics[key] || 0) + 1;
      });
    });
    
    // Sort by popularity
    const sorted = Object.entries(analytics)
      .map(([paper, count]) => ({ paper, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json(sorted);
  } catch (err) {
    console.error('Error getting analytics:', err);
    res.status(500).json({ error: 'Failed to get analytics.' });
  }
});

/**
 * @route   GET /api/email/latest-assignments
 * @desc    Generates HTML email content with top 10 latest tuition assignments
 * @access  Public (but should be secured in production)
 */
app.get('/api/email/latest-assignments', async (req, res) => {
  try {
    // Fetch top 10 latest assignments
    const assignments = await Assignment
      .find({ status: 'Open' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title level subject location frequency rate description createdAt _id')
      .lean();

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'No assignments found.' });
    }

    // Generate assignment HTML blocks
    const assignmentBlocks = assignments.map(assignment => {
      const assignmentTitle = `${assignment.level} ${assignment.subject}${assignment.location ? ` (${assignment.location})` : ''}`;
      const rateDisplay = assignment.rate && assignment.rate !== 'Tutor to propose' ? `${assignment.rate}/hr` : 'Rate to be discussed';
      const frequencyDisplay = assignment.frequency || 'Frequency to be discussed';
      
      return `
        <!-- Assignment Item START -->
        <tr>
          <td style="padding:15px 20px; border-top:1px solid #eeeeee;">
            <h3 style="margin:0 0 5px; font-size:16px; color:#111827;">${assignmentTitle}</h3>
            <p style="margin:0 0 10px; font-size:14px; color:#555555;">${rateDisplay} · ${frequencyDisplay} · In-person</p>
            <a href="https://www.lioncitytutors.com/tuition-assignments?apply=${assignment._id}" 
               style="display:inline-block;padding:10px 16px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
              Apply for this Assignment
            </a>
          </td>
        </tr>
        <!-- Assignment Item END -->`;
    }).join('');

    // Complete HTML email template
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Latest Tuition Assignments</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a; color:#ffffff; padding:20px;">
              <h1 style="margin:0; font-size:20px;">LionCity Tutors</h1>
              <p style="margin:5px 0 0; font-size:14px;">Latest Tuition Assignments</p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="padding:20px; color:#333333;">
              <p style="margin:0 0 10px;">Hi {{ full_name }}! 👋</p>
              <p style="margin:0;">These are the <strong>${assignments.length} latest tuition assignments</strong> available for application:</p>
            </td>
          </tr>
          
          ${assignmentBlocks}
          
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f9fafb; color:#6b7280; font-size:12px;">
              <p style="margin:0 0 5px;">You are receiving this email because you are a registered tutor with LionCity Tutors.</p>
              <p style="margin:0;">
                <a href="{$unsubscribe_link}">{$unsubscribe_text}</a>
              </p>
            </td>
          </tr>
        </table>
        <!-- End Container -->
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Return both HTML and assignment data
    res.status(200).json({
      success: true,
      html: htmlContent,
      assignmentCount: assignments.length,
      assignments: assignments.map(a => ({
        id: a._id,
        title: `${a.level} ${a.subject}`,
        location: a.location,
        rate: a.rate,
        frequency: a.frequency,
        createdAt: a.createdAt
      }))
    });

  } catch (err) {
    console.error('Error generating email content:', err);
    res.status(500).json({ error: 'Failed to generate email content.' });
  }
});



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'my-tuition-site/dist'))); // Adjust path if needed
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-tuition-site/dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});