import { describe, test, expect } from '@jest/globals';
import { classifyInbound } from './whatsapp-webhook.js';
import { parseRateReply } from '../utils/rateCapture.js';
import { readFileSync, existsSync } from 'node:fs';

const text = (body) => ({ type: 'text', text: { body } });
const button = (t) => ({ type: 'button', button: { text: t } });
const listReply = (id) => ({ type: 'interactive', interactive: { list_reply: { id } } });
const buttonReply = (title) => ({ type: 'interactive', interactive: { button_reply: { title } } });

describe('classifyInbound', () => {
  test('reads a template Quick-Reply tap as yes/no', () => {
    expect(classifyInbound(button('Yes, interested'))).toEqual({ kind: 'reply', reply: 'yes' });
    expect(classifyInbound(button('Not available'))).toEqual({ kind: 'reply', reply: 'no' });
  });

  test('reads an interactive button tap as yes/no', () => {
    expect(classifyInbound(buttonReply('Yes, interested'))).toEqual({ kind: 'reply', reply: 'yes' });
  });

  test('reads a decline-reason list tap, recovering both the reason and its assignment', () => {
    expect(classifyInbound(listReply('rate:abc123')))
      .toEqual({ kind: 'reason', reason: 'rate', assignmentId: 'abc123' });
    expect(classifyInbound(listReply('inactive:abc123')))
      .toEqual({ kind: 'reason', reason: 'inactive', assignmentId: 'abc123' });
  });

  test('ignores a list tap carrying something that is not a decline reason', () => {
    expect(classifyInbound(listReply('bogus:abc123'))).toEqual({ kind: 'unknown' });
    expect(classifyInbound(listReply('rate'))).toEqual({ kind: 'unknown' });
  });

  test('reads typed yes/no intent, since tutors do not always tap', () => {
    expect(classifyInbound(text('yes'))).toEqual({ kind: 'reply', reply: 'yes' });
    expect(classifyInbound(text('Yep'))).toEqual({ kind: 'reply', reply: 'yes' });
    expect(classifyInbound(text('no'))).toEqual({ kind: 'reply', reply: 'no' });
    expect(classifyInbound(text('Not available'))).toEqual({ kind: 'reply', reply: 'no' });
  });

  // Regression: the decline check used to be anchored (/^not\s+.../) while the yes rule matched
  // `interested` as a bare substring. Every phrasing below was therefore recorded as INTERESTED —
  // the tutor got "we've noted your interest", counted toward the target of 6, and could be
  // shortlisted to a parent after explicitly saying no.
  test('reads a decline that does not begin with "not"', () => {
    for (const body of [
      "I'm not interested",
      'Sorry, not interested',
      'I am not interested in this one',
      'no, not interested',
      'Sorry not interested thanks',
      'Currently not interested',
      'not really interested',
      'no longer interested',
      "I'm not available",
      'Sorry I am not free',
    ]) {
      expect(classifyInbound(text(body))).toEqual({ kind: 'reply', reply: 'no' });
    }
  });

  // The negation must not reach across clauses: "free" here is availability, not a decline.
  test('does not read a negation in an unrelated clause as a decline', () => {
    expect(classifyInbound(text('not sure, but I am free')).kind).toBe('text');
    expect(classifyInbound(text('not sure')).kind).toBe('text');
  });

  // parseButton had the same ordering flaw. The live labels ("Yes, interested" / "Not available")
  // happen to work, so this guards the rename that would silently break it in the Meta console.
  test('reads a decline button label whatever its wording', () => {
    for (const label of ['Not available', 'Not interested', 'No, not interested', 'Not interested right now']) {
      expect(classifyInbound(button(label))).toEqual({ kind: 'reply', reply: 'no' });
      expect(classifyInbound(buttonReply(label))).toEqual({ kind: 'reply', reply: 'no' });
    }
    expect(classifyInbound(button('Yes, interested'))).toEqual({ kind: 'reply', reply: 'yes' });
  });

  test('passes anything else through as free text for the owner', () => {
    expect(classifyInbound(text('is this still open?'))).toEqual({ kind: 'text', body: 'is this still open?' });
  });

  test('ignores message types we do not handle', () => {
    expect(classifyInbound({ type: 'image' })).toEqual({ kind: 'unknown' });
    expect(classifyInbound({})).toEqual({ kind: 'unknown' });
  });
});

// The documented parse order is: rate (only when that tutor has a pending rateRequestedAt),
// then yes/no intent, then forward-to-owner. These assert the parsers can't fight over the
// same message — the failure this order exists to prevent is a tutor answering "40" to a rate
// prompt on a $40-60 assignment and having it read as something else.
describe('parse-order precedence', () => {
  test('a bare number is a rate and is NOT claimed by the yes/no parser', () => {
    for (const body of ['40', '$40', '45/hr', '250']) {
      expect(parseRateReply(body)).not.toBeNull();
      expect(classifyInbound(text(body)).kind).toBe('text');
    }
  });

  test('yes/no intent is NOT claimed by the rate parser, so a Yes can never become a rate', () => {
    for (const body of ['yes', 'no', 'yep', 'interested', 'nope']) {
      expect(parseRateReply(body)).toBeNull();
      expect(classifyInbound(text(body)).kind).toBe('reply');
    }
  });

  test('a rate-shaped message still classifies as text, so an unasked number reaches the owner', () => {
    // parseRateReply matching is necessary but not sufficient: without a pending rateRequestedAt
    // the webhook falls through, and this is what makes that fall-through land on the owner.
    expect(classifyInbound(text('45')).kind).toBe('text');
  });

  test('prose containing a number is neither a rate nor a reply — it goes to the owner', () => {
    expect(parseRateReply('I can do 45 if the timing changes')).toBeNull();
    expect(classifyInbound(text('I can do 45 if the timing changes')).kind).toBe('text');
  });
});

// The dormant whatsapp-web.js VM service carries its own copy of the decline pattern — it
// deploys standalone and cannot import from here. This is the only thing that will notice if
// the two drift, which matters because the copy is what runs if the VM is ever switched back on.
describe('legacy VM parser stays in step', () => {
  const servicePath = new URL('../whatsapp-service/index.js', import.meta.url);

  test('whatsapp-service uses the same NEGATED_AVAILABILITY pattern', () => {
    if (!existsSync(servicePath)) return; // service deleted — nothing to keep in step
    const src = readFileSync(servicePath, 'utf8');
    const vmPattern = src.match(/const NEGATED_AVAILABILITY =\s*(\/.*\/);/)?.[1];
    const ourPattern = readFileSync(new URL('./whatsapp-webhook.js', import.meta.url), 'utf8')
      .match(/const NEGATED_AVAILABILITY =\s*(\/.*\/);/)?.[1];
    expect(vmPattern).toBeDefined();
    expect(vmPattern).toBe(ourPattern);
  });
});
