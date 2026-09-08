import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  startAssignmentCreation, handleAssignmentCallbackQuery, handleAssignmentStep,
} from '../bot/handlers.js';

// Drives the real wizard against a bot that just records the last screen, so these test the
// navigation the owner actually sees rather than the helpers underneath it.
let last;
const bot = {
  editMessageText: async (text, o) => { last = { text, keyboard: o.reply_markup.inline_keyboard }; },
  sendMessage: async (_chat, text, o) => {
    last = { text, keyboard: o?.reply_markup?.inline_keyboard };
    return { message_id: 9 };
  },
  answerCallbackQuery: async () => {},
};

let sessions;
const tap = (data) => handleAssignmentCallbackQuery(
  bot,
  { id: 'q', data, message: { chat: { id: 1 }, message_id: 9 } },
  sessions,
  async () => {},
);
const type = (text) => handleAssignmentStep(bot, 1, text, sessions, {});
const back = () => tap('assignment_back');
const data = () => sessions[1].assignmentData;
const screen = () => last.text.match(/Step [\w]+ of 11/)?.[0];
const buttons = () => last.keyboard.flat();
const hasBack = () => buttons().some(b => b.callback_data === 'assignment_back');

const enc = encodeURIComponent;

beforeEach(async () => {
  sessions = {};
  last = null;
  await startAssignmentCreation(bot, 1, sessions);
});

describe('the Back button', () => {
  test('is absent on the first step, where there is nothing behind it', () => {
    expect(screen()).toBe('Step 1 of 11');
    expect(hasBack()).toBe(false);
  });

  test('appears from the second step onwards', async () => {
    await type('P4 Maths');
    expect(screen()).toBe('Step 2 of 11');
    expect(hasBack()).toBe(true);
  });

  test('sits beside Cancel rather than adding a row', async () => {
    await type('P4 Maths');
    const row = last.keyboard[last.keyboard.length - 1].map(b => b.callback_data);
    expect(row).toEqual(['assignment_back', 'admin_panel']);
  });

  test('does nothing at the first step instead of falling out of the wizard', async () => {
    await back();
    expect(screen()).toBe('Step 1 of 11');
    expect(sessions[1].assignmentData).toBeDefined();
  });
});

describe('going back unanswers the step it lands on', () => {
  beforeEach(async () => {
    await type('P4 Maths');
    await tap(`select_level_${enc('Primary 4')}`);
  });

  test('clears the answer given on that step', async () => {
    await tap(`select_subject_${enc('Mathematics')}`);
    expect(data().subject).toBe('Mathematics');
    await back();
    expect(screen()).toBe('Step 3 of 11');
    expect(data().subject).toBeUndefined();
  });

  test('keeps the answers from the steps before it', async () => {
    await tap(`select_subject_${enc('Mathematics')}`);
    await back();
    expect(data().level).toBe('Primary 4');
    expect(data().title).toBe('P4 Maths');
  });

  test('clears a multi-select rather than leaving it half-ticked', async () => {
    await tap(`select_subject_${enc('Mathematics')}`);
    await tap(`select_location_${enc('Bishan')}`);
    await tap('toggle_tutor_pref_parttime');
    expect(data().preferredTutorTypes).toEqual(['Part-time']);
    await tap('confirm_tutor_types');
    await back();
    expect(screen()).toBe('Step 5 of 11');
    expect(data().preferredTutorTypes).toEqual([]);
    expect(buttons().filter(b => b.text.startsWith('✅ Part-time'))).toHaveLength(0);
  });
});

describe('going back follows the route actually taken', () => {
  beforeEach(async () => {
    await type('P4 Maths and Science');
    await tap(`select_level_${enc('Primary 4')}`);
  });

  test('returns through the Multiple Subjects steps, not past them', async () => {
    await tap(`select_subject_${enc('Multiple Subjects')}`);
    await tap('pick_subj_4');
    await tap('pick_subj_5');
    await tap('confirm_subjects');
    expect(screen()).toBe('Step 3c of 11');

    await back();
    expect(screen()).toBe('Step 3b of 11');
    expect(data().subjects).toEqual([]);

    await back();
    expect(screen()).toBe('Step 3 of 11');
  });

  test('skips them entirely for a single subject', async () => {
    await tap(`select_subject_${enc('Mathematics')}`);
    expect(screen()).toBe('Step 4 of 11');
    await back();
    expect(screen()).toBe('Step 3 of 11');
  });
});

describe('going back across the rate fork', () => {
  beforeEach(async () => {
    await type('P4 Maths');
    await tap(`select_level_${enc('Primary 4')}`);
    await tap(`select_subject_${enc('Mathematics')}`);
    await tap(`select_location_${enc('Bishan')}`);
    await tap('confirm_tutor_types');
    await type('Twice a week');
  });

  test('leaving the custom-rate prompt stops the wizard waiting for a typed rate', async () => {
    await tap('select_rate_custom');
    expect(sessions[1].waitingForCustomRate).toBe(true);
    await back();
    expect(sessions[1].waitingForCustomRate).toBe(false);
    expect(last.text).toContain('Select the rate type');
  });

  test('leaving the market rate drops it, so no stale rate survives', async () => {
    await tap('select_rate_market');
    expect(data().rate).toContain('/hr');
    await back();
    expect(data().rate).toBeUndefined();
  });
});

describe('a new assignment starts with a clean history', () => {
  test('back does not walk into the previous run', async () => {
    await type('P4 Maths');
    await tap(`select_level_${enc('Primary 4')}`);
    await startAssignmentCreation(bot, 1, sessions);
    expect(screen()).toBe('Step 1 of 11');
    expect(hasBack()).toBe(false);
    await back();
    expect(screen()).toBe('Step 1 of 11');
  });
});
