#!/usr/bin/env node

/**
 * Get fresh HTML email content for Sender.net campaigns
 * Usage: node scripts/getEmailHTML.js
 */

import fetch from 'node-fetch';
import fs from 'fs';

async function getEmailHTML() {
  try {
    console.log('🔄 Fetching latest assignments...');
    
    const response = await fetch('http://localhost:4000/api/email/latest-assignments');
    const data = await response.json();
    
    if (data.success) {
      // Save HTML to file
      fs.writeFileSync('latest-email.html', data.html);
      
      console.log('✅ Email HTML generated successfully!');
      console.log(`📊 Found ${data.assignmentCount} assignments`);
      console.log('💾 HTML saved to: latest-email.html');
      console.log('\n📋 Assignments included:');
      
      data.assignments.forEach((assignment, index) => {
        console.log(`${index + 1}. ${assignment.title} - ${assignment.location} - ${assignment.rate}`);
      });
      
      console.log('\n🎯 Next steps:');
      console.log('1. Open latest-email.html in a text editor');
      console.log('2. Copy all the HTML content');
      console.log('3. Paste into Sender.net custom HTML template');
      console.log('4. Send to your 300 tutors!');
      
    } else {
      console.error('❌ Error:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Failed to fetch email content:', error.message);
    console.log('\n🔧 Make sure your backend server is running:');
    console.log('   npm start (in apps/backend directory)');
  }
}

getEmailHTML();