// Inline-keyboard rows for the day-30 check-in recording flow (roadmap Phase 5), kept in one place
// so the tick's owner ping (api/escalation-tick.js) and any re-show land the exact same callbacks.
// Callback grammar (parsed in bot/handlers.js):
//   ciwell_<placementId>            → parent says going well → asks for a 1–5 rating
//   cirate_<placementId>_<1..5>     → the rating tap → records well + rating
//   ciended_<placementId>           → tuition ended → records ended, then asks the owner to type why
//   cinoreply_<placementId>         → owner marks it no-reply

// The three outcome buttons shown on the check-in ping.
export function checkInButtonRows(placementId) {
  return [
    [{ text: '✅ Going well', callback_data: `ciwell_${placementId}` }],
    [{ text: '🔚 It ended → why?', callback_data: `ciended_${placementId}` }],
    [{ text: '🕓 No reply', callback_data: `cinoreply_${placementId}` }],
  ];
}

// The 1–5 rating buttons shown after "Going well" is tapped. One row of five so it stays a single
// thumb-reach on a phone.
export function checkInRatingRows(placementId) {
  return [
    [1, 2, 3, 4, 5].map(n => ({ text: `${n}⭐`, callback_data: `cirate_${placementId}_${n}` })),
  ];
}
