// "91234567" → "9123 4567" for display.
export function formatPhone(phone) {
  return phone.replace(/^(\d{4})(\d{4})$/, '$1 $2');
}
