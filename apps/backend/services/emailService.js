import nodemailer from 'nodemailer';
import { Assignment } from '../../../packages/shared/server-exports.js';

/**
 * Email service for sending tuition assignment newsletters
 */
class EmailService {
  constructor() {
    // Configure your email transporter
    // Supports both Gmail and custom domain configurations
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD // Your password or app password
      }
    });
  }

  /**
   * Fetches the latest assignments and formats them into HTML
   * @param {number} limit - Number of assignments to fetch (default: 10)
   * @returns {Object} - Contains HTML content and assignment data
   */
  async generateAssignmentEmailContent(limit = 10) {
    try {
      // Fetch latest assignments
      const assignments = await Assignment
        .find({ status: 'Open' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title level subject location frequency rate description createdAt _id')
        .lean();

      if (assignments.length === 0) {
        throw new Error('No assignments found');
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
              <p style="margin:0 0 10px;">Hi tutors! 👋</p>
              <p style="margin:0;">These are the <strong>${assignments.length} latest tuition assignments</strong> available for application:</p>
            </td>
          </tr>
          
          ${assignmentBlocks}
          
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f9fafb; color:#6b7280; font-size:12px;">
              <p style="margin:0 0 5px;">You are receiving this email because you are a registered tutor with LionCity Tutors.</p>
              <p style="margin:0;">
                <a href="{{unsubscribe_link}}">{{unsubscribe_text}}</a>
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

      return {
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
      };

    } catch (error) {
      console.error('Error generating email content:', error);
      throw error;
    }
  }

  /**
   * Sends assignment newsletter to a list of recipients
   * @param {Array} recipients - Array of email addresses
   * @param {string} subject - Email subject line
   * @param {number} assignmentLimit - Number of assignments to include
   * @returns {Object} - Send result
   */
  async sendAssignmentNewsletter(recipients, subject = 'Latest Tuition Assignments - LionCity Tutors', assignmentLimit = 10) {
    try {
      // Generate email content
      const emailContent = await this.generateAssignmentEmailContent(assignmentLimit);

      // Prepare email options
      const mailOptions = {
        from: `"LionCity Tutors" <${process.env.EMAIL_USER}>`,
        bcc: recipients, // Use BCC to hide recipient list
        subject: subject,
        html: emailContent.html,
        text: `Latest ${emailContent.assignmentCount} tuition assignments are now available. Visit https://www.lioncitytutors.com/tuition-assignments to view and apply.`
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        recipientCount: recipients.length,
        assignmentCount: emailContent.assignmentCount
      };

    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }

  /**
   * Sends a test email to verify the service is working
   * @param {string} testEmail - Email address to send test to
   * @returns {Object} - Send result
   */
  async sendTestEmail(testEmail) {
    try {
      const emailContent = await this.generateAssignmentEmailContent(3); // Just 3 assignments for testing

      const mailOptions = {
        from: `"LionCity Tutors" <${process.env.EMAIL_USER}>`,
        to: testEmail,
        subject: 'TEST: Latest Tuition Assignments - LionCity Tutors',
        html: emailContent.html,
        text: `This is a test email. Latest ${emailContent.assignmentCount} tuition assignments are shown above.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        assignmentCount: emailContent.assignmentCount
      };

    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }
}

export default EmailService;