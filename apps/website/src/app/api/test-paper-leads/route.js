import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';
import { presignDownload } from '@/lib/r2.mjs';
import { isKnownFileKey, isKnownPaperKey, downloadFilename } from '@/lib/downloadKeys.mjs';

const testPaperLeadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Null on leads captured before the gate asked.
  role: { type: String, enum: ['parent', 'student'], default: null },
  downloads: [{
    subject: String,
    year: String,
    level: String,
    // Identifies the exact paper. Null on rows written before this was tracked.
    paperKey: String,
    paperTitle: String,
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const TestPaperLead = mongoose.models.TestPaperLead || mongoose.model('TestPaperLead', testPaperLeadSchema);

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^\d{8,}$/;
const ROLES = new Set(['parent', 'student']);

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { email, phone, role: rawRole, subject, year, level, fileKey, paperKey, paperTitle } = data;

    if (!EMAIL_RE.test(email || '') || !PHONE_RE.test((phone || '').replace(/\s/g, ''))) {
      return NextResponse.json({ success: false, error: 'Invalid email or phone.' }, { status: 400 });
    }
    if (fileKey && !isKnownFileKey(fileKey)) {
      return NextResponse.json({ success: false, error: 'Unknown file.' }, { status: 400 });
    }

    // Analytics only, so an unrecognised key is dropped rather than failing the download.
    const download = {
      subject,
      year,
      level,
      paperKey: isKnownPaperKey(paperKey) ? paperKey : null,
      paperTitle,
    };

    // Older cached pages post no role; keep whatever the lead already has.
    const role = ROLES.has(rawRole) ? rawRole : undefined;

    let lead = await TestPaperLead.findOne({ email });
    if (lead) {
      lead.downloads.push(download);
      if (role) lead.role = role;
      await lead.save();
    } else {
      lead = new TestPaperLead({ email, phone, role, downloads: [download] });
      await lead.save();
    }

    let downloadUrl;
    if (fileKey) {
      downloadUrl = await presignDownload(fileKey, downloadFilename(fileKey));
    }
    return NextResponse.json({ success: true, message: 'Download tracked successfully!', downloadUrl });
  } catch (err) {
    console.error('Error tracking download:', err);
    return NextResponse.json({ success: false, error: 'Failed to track download.' }, { status: 500 });
  }
}
