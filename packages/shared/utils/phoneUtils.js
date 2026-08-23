/**
 * Canonicalize a phone number to its 8-digit Singapore local form for matching.
 * Stored tutor numbers and inbound WhatsApp numbers arrive in mixed shapes
 * ("+65 9123 4567", "6591234567", "9123 4567") — reduce them all to "91234567"
 * so a contact can be matched to the tutor who replied.
 *
 * The 65 prefix is only stripped when digits remain beyond 8, so an 8-digit
 * landline like "65123456" survives intact.
 */
export function normalizePhone(phone) {
  let digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length > 8 && digits.startsWith('65')) digits = digits.slice(2);
  return digits.slice(-8);
}

/**
 * Returns all plausible representations of a Singapore phone number that
 * may appear in the database (with/without country code, spaces, dashes, etc.).
 * Includes the original input so records stored verbatim are still matched.
 */
export function generatePhoneVariations(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return [];

  const spaced = normalized.replace(/(\d{4})(\d{4})/, '$1 $2');
  const dashed = normalized.replace(/(\d{4})(\d{4})/, '$1-$2');

  const variations = [
    normalized,              // 96571013
    `65${normalized}`,       // 6596571013
    `+65${normalized}`,      // +6596571013
    `+65 ${normalized}`,     // +65 96571013
    spaced,                  // 9657 1013
    dashed,                  // 9657-1013
    `65${spaced}`,           // 659657 1013
    `65 ${normalized}`,      // 65 96571013
    `65 ${spaced}`,          // 65 9657 1013
    `+65${spaced}`,          // +659657 1013
    `+65 ${spaced}`,         // +65 9657 1013
    phone,                   // original input (catches verbatim stored values)
  ];

  return [...new Set(variations)].filter(v => v && String(v).length > 0);
}
