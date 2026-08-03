import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';
import { presignDownload } from '@/lib/r2.mjs';
import { isKnownFileKey } from '@/lib/downloadKeys.mjs';

const testPaperLeadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  downloads: [{
    subject: String,
    year: String,
    level: String,
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const TestPaperLead = mongoose.models.TestPaperLead || mongoose.model('TestPaperLead', testPaperLeadSchema);

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

    let lead = await TestPaperLead.findOne({ email });
    if (lead) {
      lead.downloads.push({ subject, year, level });
      await lead.save();
    } else {
      lead = new TestPaperLead({
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
    return NextResponse.json({ success: true, message: 'Download tracked successfully!', downloadUrl });
  } catch (err) {
    console.error('Error tracking download:', err);
    return NextResponse.json({ success: false, error: 'Failed to track download.' }, { status: 500 });
  }
}
