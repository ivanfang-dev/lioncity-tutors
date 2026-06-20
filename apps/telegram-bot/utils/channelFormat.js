import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';

// Formats an assignment for the public Telegram channel post. Shared by the bot (initial
// post) and the auto-close job (re-render on close), so the layout stays identical.
// Status-aware: an Open assignment invites applications; a Closed one shows a closed
// notice instead, so tutors stop asking about progress.
export function formatAssignmentForChannel(assignment) {
  let msg = `🎯 *Title:* ${assignment.title}\n\n`;
  msg += `📚 *Level:* ${assignment.level}\n`;
  msg += `📖 *Subject:* ${assignment.subject}\n`;
  msg += `📍 *Location:* ${assignment.location}\n`;
  msg += `📅 *Frequency:* ${assignment.frequency}\n`;
  msg += `💰 *Rate:* ${assignment.rate}\n`;
  msg += `👨‍🏫 *Tutor Type:* ${assignment.preferredTutorTypes?.length > 0 ? assignment.preferredTutorTypes.join(', ') : 'Any'}\n`;

  const channelSlots = formatTimeSlots(assignment.preferredTimeSlots);
  if (channelSlots) msg += `⏰ *Timing:* ${channelSlots}\n`;
  if (assignment.preferredGender && assignment.preferredGender !== 'No preference') {
    msg += `🧑 *Tutor Gender:* ${assignment.preferredGender}\n`;
  }

  if (assignment.description) {
    msg += `\n📝 *Description:* ${assignment.description}\n`;
  }

  if (assignment.status === 'Open') {
    msg += `\n💼 *Status:* Open`;
    msg += `\n\n👇 *Click below to apply for this assignment!*`;
  } else {
    msg += `\n🔒 *Status:* ${assignment.status}`;
    msg += `\n\n✅ *This assignment is no longer open for applications.*`;
  }

  return msg;
}
