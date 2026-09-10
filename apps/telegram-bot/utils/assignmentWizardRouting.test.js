import { describe, test, expect } from '@jest/globals';
import {
  startAssignmentCreation, handleAssignmentCallbackQuery, handleAssignmentStep,
  isAssignmentWizardCallback,
} from '../bot/handlers.js';

// handleCallbackQuery routes wizard taps by prefix; anything unlisted falls through to a
// "not yet implemented" reply. So it isn't enough that the wizard HANDLES a button — the router
// has to hand it over first. This walks the wizard, collects every button it actually draws, and
// checks each one is routable. Driving the handler directly (as the other tests do) cannot catch
// this: it bypasses the router entirely, which is how the subject picker shipped unreachable.
async function collectWizardButtons() {
  const drawn = [];
  const bot = {
    editMessageText: async (_t, o) => drawn.push(o.reply_markup.inline_keyboard),
    sendMessage: async (_c, _t, o) => {
      if (o?.reply_markup?.inline_keyboard) drawn.push(o.reply_markup.inline_keyboard);
      return { message_id: 9 };
    },
    answerCallbackQuery: async () => {},
  };
  const sessions = {};
  const tap = (data) => handleAssignmentCallbackQuery(
    bot, { id: 'q', data, message: { chat: { id: 1 }, message_id: 9 } }, sessions, async () => {});
  const type = (text) => handleAssignmentStep(bot, 1, text, sessions, {});
  const enc = encodeURIComponent;

  // Both routes through step 3, so the Multiple Subjects screens are drawn too.
  await startAssignmentCreation(bot, 1, sessions);
  await type('P4 Maths and Science');
  await tap(`select_level_${enc('Primary 4')}`);
  await tap(`select_subject_${enc('Multiple Subjects')}`);
  await tap('pick_subj_4');
  await tap('pick_subj_5');
  await tap('confirm_subjects');
  await tap('subject_mode_split');
  await tap(`select_location_${enc('Bishan')}`);
  await tap('toggle_tutor_pref_parttime');
  await tap('confirm_tutor_types');
  await type('Twice a week');
  await tap('select_rate_custom');
  await tap('assignment_back');
  await tap('select_rate_market');
  await tap('select_rate_accept');
  await tap('toggle_assignment_slot_weekdayEvening');
  await tap('confirm_assignment_slots');
  await tap('set_assignment_gender_female');

  return [...new Set(drawn.flat(2).map(b => b.callback_data).filter(Boolean))];
}

describe('every button the wizard draws reaches the wizard', () => {
  test('the walk actually draws the screens under test', async () => {
    const buttons = await collectWizardButtons();
    for (const expected of ['pick_subj_4', 'confirm_subjects', 'subject_mode_split', 'assignment_back']) {
      expect(buttons).toContain(expected);
    }
  });

  test('no wizard button falls through to the not-implemented catch-all', async () => {
    const unroutable = (await collectWizardButtons())
      // Cancel belongs to the admin panel, not the wizard, and is routed separately.
      .filter(data => data !== 'admin_panel')
      .filter(data => !isAssignmentWizardCallback(data));
    expect(unroutable).toEqual([]);
  });
});

describe('isAssignmentWizardCallback', () => {
  test('does not swallow callbacks belonging to other flows', () => {
    for (const data of [
      'admin_panel', 'view_assignments', 'edit_primary_subjects', 'toggle_primary_mathematics',
      'confirm_post_assignment_abc', 'confirm_post_group_abc', 'cancel_group_abc', 'cancel_draft_abc',
    ]) {
      expect(isAssignmentWizardCallback(data)).toBe(false);
    }
  });
});
