import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';

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

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { email, phone, subject, year, level } = data;

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
    return NextResponse.json({ success: true, message: 'Download tracked successfully!' });
  } catch (err) {
    console.error('Error tracking notes download:', err);
    return NextResponse.json({ success: false, error: 'Failed to track download.' }, { status: 500 });
  }
}
