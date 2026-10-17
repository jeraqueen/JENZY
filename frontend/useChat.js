// frontend/useChat.js
// Call this from your frontend code (make sure it is included by your build or script loader).
// If PROJECT_SECRET is set, include it in the header as below.
export async function sendToChat(input) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'x-project-secret': 'some-random-secret' // uncomment if you set PROJECT_SECRET
    },
    body: JSON.stringify({ input })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(JSON.stringify(err));
  }
  return await res.json();
}
