// Client-side POST to the messaged log; keepalive so it survives the chat opening.
export function postManualContact(body) {
  return fetch('/api/ops/manual-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  });
}
