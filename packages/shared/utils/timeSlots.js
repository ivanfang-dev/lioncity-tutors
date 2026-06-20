// Lesson-timing slots shared by tutor availability (Tutor.availableTimeSlots) and
// assignment preferences (Assignment.preferredTimeSlots), so the two are always matched
// against the same canonical set. Single source of truth — used by the matcher, the
// assignment wizard, and the tutor-facing messages.
export const TIME_SLOTS = [
  { key: 'weekdayMorning', label: 'Weekday Morning' },
  { key: 'weekdayAfternoon', label: 'Weekday Afternoon' },
  { key: 'weekdayEvening', label: 'Weekday Evening' },
  { key: 'weekendMorning', label: 'Weekend Morning' },
  { key: 'weekendAfternoon', label: 'Weekend Afternoon' },
  { key: 'weekendEvening', label: 'Weekend Evening' }
];

export const TIME_SLOT_KEYS = TIME_SLOTS.map(s => s.key);

// Render a slots object ({ weekdayAfternoon: true, ... }) as "Weekday Afternoon, Weekend
// Morning". Returns '' when nothing is selected (= no timing requirement).
export function formatTimeSlots(slots) {
  if (!slots) return '';
  return TIME_SLOTS.filter(s => slots[s.key]).map(s => s.label).join(', ');
}
