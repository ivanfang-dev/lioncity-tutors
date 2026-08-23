// Escaping for Telegram's legacy-Markdown parse mode, which every bot message uses.
//
// The parser rejects the WHOLE message ("can't parse entities") when _ * [ ] ` are unbalanced,
// and silently mangles it when they happen to balance. That matters because so much of what we
// interpolate is free text somebody typed: assignment titles and descriptions, frequencies and
// rates, tutor names. A tutor called "Wei_Ling" or a title like "P5 Math_HL" is enough to drop
// an owner alert or a channel post.
//
// Escape VALUES only — the literal *bold* markers around them are ours and must stay live.
export function escapeMd(text) {
  return String(text ?? '').replace(/[_*[\]`]/g, '\\$&');
}
