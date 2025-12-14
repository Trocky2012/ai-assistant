// src/api/AssistantApi.jsx
const API = process.env.REACT_APP_API_BASE_URL;

export async function sendMessage({
  userId,
  email,
  userMessage
}) {
  const res = await fetch(`${API}chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      email,
      userMessage
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Chat failed");
  }

  return data.reply;
}
