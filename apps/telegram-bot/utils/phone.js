// Canonicalize a phone number to its 8-digit Singapore local form for matching.
// Stored tutor numbers and inbound WhatsApp reply numbers arrive in mixed shapes
// ("+65 9123 4567", "6591234567", "9123 4567") — reduce them all to "91234567"
// so an outreach contact can be matched to the tutor who replied.
export function normalizePhone(raw) {
  let digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.length > 8 && digits.startsWith('65')) digits = digits.slice(2);
  return digits.slice(-8);
}
