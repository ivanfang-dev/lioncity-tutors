import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';
import { escapeMd } from './markdown.js';

// Formats an assignment for the public Telegram channel post. Shared by the bot (initial
// post) and the auto-close job (re-render on close), so the layout stays identical.
// Status-aware: an Open assignment invites applications; a Closed one shows a closed
// notice instead, so tutors stop asking about progress.
export function formatAssignmentForChannel(assignment) {
  // Values are escaped, the *bold* markers around them are not: title, frequency, rate and
  // description are all typed by hand at creation, and one stray _ or * makes Telegram reject
  // the whole post — which would leave the assignment Open but never published to the channel.
  let msg = `🎯 *Title:* ${escapeMd(assignment.title)}\n\n`;
  msg += `📚 *Level:* ${escapeMd(assignment.level)}\n`;
  msg += `📖 *Subject:* ${escapeMd(assignment.subject)}\n`;
  msg += `📍 *Location:* ${escapeMd(assignment.location)}\n`;
  msg += `📅 *Frequency:* ${escapeMd(assignment.frequency)}\n`;
  msg += `💰 *Rate:* ${escapeMd(assignment.rate)}\n`;
  msg += `👨‍🏫 *Tutor Type:* ${assignment.preferredTutorTypes?.length > 0 ? escapeMd(assignment.preferredTutorTypes.join(', ')) : 'Any'}\n`;

  const channelSlots = formatTimeSlots(assignment.preferredTimeSlots);
  if (channelSlots) msg += `⏰ *Timing:* ${escapeMd(channelSlots)}\n`;
  if (assignment.preferredGender && assignment.preferredGender !== 'No preference') {
    msg += `🧑 *Tutor Gender:* ${escapeMd(assignment.preferredGender)}\n`;
  }

  if (assignment.description) {
    msg += `\n📝 *Description:* ${escapeMd(assignment.description)}\n`;
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
