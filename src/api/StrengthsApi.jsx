// src/api/StrengthsApi.jsx
const API = process.env.REACT_APP_API_BASE_URL;

/* -------------------- GET -------------------- */
export async function getStrengths() {
  const res = await fetch(`${API}get-strengths`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error("Failed to load strengths");
  }

  return data.items;
}

/* -------------------- ADD (single) -------------------- */
export async function addStrength({ userId, email, key, value }) {
  const res = await fetch(`${API}add-strength`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, email, key, value })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to add strength");
  }
}

/* -------------------- ADD (JSON list) -------------------- */
export async function addStrengthsFromJson({ userId, email, rawJson }) {
  let parsed;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error("Invalid JSON format");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON must be an array of { key, value } objects");
  }

  parsed.forEach((item, i) => {
    if (!item.key || !item.value) {
      throw new Error(
        `Invalid item at index ${i}. Each item must have key and value`
      );
    }
  });

  const res = await fetch(`${API}add-strength`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      email,
      items: parsed
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to save strengths");
  }
}

/* -------------------- DELETE -------------------- */
export async function deleteStrength({ userId, email, id }) {
  const res = await fetch(`${API}delete-strength`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, email, id })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error("Failed to delete strength");
  }
}
