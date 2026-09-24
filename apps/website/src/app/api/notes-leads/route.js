import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';
import { normalizeLeadPhone } from '@/lib/phone.mjs';
import { presignDownload } from '@/lib/r2.mjs';
import { queueParentNurture } from '@/lib/senderNurture.mjs';
import { isKnownFileKey, downloadFilename } from '@/lib/downloadKeys.mjs';

// /free-notes has always posted here, but the route did not exist: every notes
// download 404'd, showed the error toast and never opened the file. Mirrors
// test-paper-leads, with its own collection so paper leads stay untouched.
const notesLeadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Null on leads captured before the gate asked.
  role: { type: String, enum: ['parent', 'student'], default: null },
  // Level buckets already pushed to Sender.net, so each is sent once.
  nurtureGroups: [String],
  downloads: [{
    subject: String,
    year: String,
    level: String,
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const NotesLead = mongoose.models.NotesLead || mongoose.model('NotesLead', notesLeadSchema);

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const ROLES = new Set(['parent', 'student']);

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { email: rawEmail, phone: rawPhone, role: rawRole, subject, year, level, fileKey } = data;

    // One stored shape per lead, so the same parent isn't split across spellings.
    const email = (rawEmail || '').trim().toLowerCase();
    const phone = normalizeLeadPhone(rawPhone);
    if (!EMAIL_RE.test(email) || !phone) {
      return NextResponse.json({ success: false, error: 'Invalid email or phone.' }, { status: 400 });
    }
    if (fileKey && !isKnownFileKey(fileKey)) {
      return NextResponse.json({ success: false, error: 'Unknown file.' }, { status: 400 });
    }

    // Older cached pages post no role; keep whatever the lead already has.
    const role = ROLES.has(rawRole) ? rawRole : undefined;

    let lead = await NotesLead.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (lead) {
      lead.downloads.push({ subject, year, level });
      if (role) lead.role = role;
      await lead.save();
    } else {
      lead = new NotesLead({
        email,
        phone,
        role,
        downloads: [{ subject, year, level }]
      });
      await lead.save();
    }

    queueParentNurture(NotesLead, lead, { level, subject });

    let downloadUrl;
    if (fileKey) {
      downloadUrl = await presignDownload(fileKey, downloadFilename(fileKey));
    }
    return NextResponse.json({ success: true, downloadUrl });
  } catch (err) {
    console.error('Error tracking notes download:', err);
    return NextResponse.json({ success: false, error: 'Failed to track download.' }, { status: 500 });
  }
}
