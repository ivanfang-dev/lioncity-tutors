/**
 * Strips non-digits and removes leading Singapore country code (65).
 * Returns a normalized 8-digit string, or empty string if input is invalid.
 */
export function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '').replace(/^65/, '');
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

  return [...new Set(variations)].filter(v => v.length > 0);
}
