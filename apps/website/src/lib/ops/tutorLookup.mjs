// Find page lookup: a typed name or phone number → a Tutor query, and a tutor doc → a card.

const LEVEL_LABELS = {
  preschool: 'Pre-school', primary: 'Primary', secondary: 'Secondary', jc: 'JC', ib: 'IB',
  music: 'Music', polytechnic: 'Poly', university: 'University', professional: 'Professional',
};

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Digits only → phone (any spacing, with or without +65); otherwise a name. null if too short.
export function lookupQuery(text) {
  const q = String(text || '').trim();
  if (!/[a-z]/i.test(q)) {
    let digits = q.replace(/\D/g, '');
    if (digits.length > 8 && digits.startsWith('65')) digits = digits.slice(2);
    if (digits.length < 3) return null;
    return { contactNumber: { $regex: digits.split('').join('[^0-9]*') } };
  }
  if (q.length < 2) return null;
  // From the start of any word, so "tan" finds Tans but not "Shtanger".
  return { fullName: { $regex: `(^|[^a-z])${escapeRegex(q)}`, $options: 'i' } };
}

export const LOOKUP_FIELDS =
  'fullName contactNumber tutorType yearsOfExperience highestEducation hourlyRate teachingLevels locations ' +
  'introduction teachingExperience trackRecord responseStats stats pausedAt';

// Same shape as a search result, plus every level's rate, the levels taught and the regions covered.
export function lookupCard(t) {
  return {
    id: String(t._id),
    fullName: t.fullName,
    contactNumber: t.contactNumber,
    tutorType: t.tutorType || null,
    yearsOfExperience: t.yearsOfExperience || null,
    highestEducation: t.highestEducation || null,
    rates: Object.entries(LEVEL_LABELS)
      .filter(([key]) => t.hourlyRate?.[key]?.trim())
      .map(([key, label]) => ({ label, rate: t.hourlyRate[key].trim() })),
    levels: Object.entries(LEVEL_LABELS)
      .filter(([key]) => Object.values(t.teachingLevels?.[key] || {}).some(v => v === true))
      .map(([, label]) => label),
    regions: Object.entries(t.locations || {}).filter(([, on]) => on === true).map(([r]) => r),
    introduction: t.introduction || '',
    teachingExperience: t.teachingExperience || '',
    trackRecord: t.trackRecord || '',
    placed: t.stats?.placed || 0,
    replies: { contacted: t.responseStats?.contacted || 0, responded: t.responseStats?.responded || 0 },
    paused: Boolean(t.pausedAt),
  };
}
