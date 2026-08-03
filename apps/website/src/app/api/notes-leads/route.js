import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';
import { presignDownload } from '@/lib/r2.mjs';
import { isKnownFileKey } from '@/lib/downloadKeys.mjs';

// /free-notes has always posted here, but the route did not exist: every notes
// download 404'd, showed the error toast and never opened the file. Mirrors
// test-paper-leads, with its own collection so paper leads stay untouched.
const notesLeadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  downloads: [{
    subject: String,
    year: String,
    level: String,
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const NotesLead = mongoose.models.NotesLead || mongoose.model('NotesLead', notesLeadSchema);

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^\d{8,}$/;

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { email, phone, subject, year, level, fileKey } = data;

    if (!EMAIL_RE.test(email || '') || !PHONE_RE.test((phone || '').replace(/\s/g, ''))) {
      return NextResponse.json({ success: false, error: 'Invalid email or phone.' }, { status: 400 });
    }
    if (fileKey && !isKnownFileKey(fileKey)) {
      return NextResponse.json({ success: false, error: 'Unknown file.' }, { status: 400 });
    }

    let lead = await NotesLead.findOne({ email });
    if (lead) {
      lead.downloads.push({ subject, year, level });
      await lead.save();
    } else {
      lead = new NotesLead({
        email,
        phone,
        downloads: [{ subject, year, level }]
      });
      await lead.save();
    }

    let downloadUrl;
    if (fileKey) {
      downloadUrl = await presignDownload(fileKey, fileKey.split('/').pop());
    }
    return NextResponse.json({ success: true, downloadUrl });
  } catch (err) {
    console.error('Error tracking notes download:', err);
    return NextResponse.json({ success: false, error: 'Failed to track download.' }, { status: 500 });
  }
}
