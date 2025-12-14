// src/api/ExperiencesApi.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Normalize payload:
 * - Accepts single object
 * - Accepts array of objects (JSON mode)
 */
function normalizeExperiencePayload(payload) {
  // Array of experiences
  if (Array.isArray(payload)) {
    return payload.map(item => ({
      company: String(item.company || "").trim(),
      position: String(item.position || "").trim(),
      startDate: item.startDate || null,
      endDate: item.endDate || null,
      description: String(item.description || "").trim()
    }));
  }

  // Single experience
  return {
    company: String(payload.company || "").trim(),
    position: String(payload.position || "").trim(),
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    description: String(payload.description || "").trim()
  };
}

/**
 * Save experience(s)
 */
export async function addExperience({
  userId,
  email,
  jsonData,
  rawJson,
  form
}) {
  let parsedPayload;

  // 1️⃣ Parse input
  if (jsonData) {
    parsedPayload = JSON.parse(rawJson);
  } else {
    parsedPayload = {
      company: form.company,
      position: form.position,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description
    };
  }

  // 2️⃣ Normalize (single or list)
  const normalizedPayload = normalizeExperiencePayload(parsedPayload);

  // 3️⃣ Send to backend
  const res = await fetch(`${API_BASE_URL}add-experience`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      email,
      experiences: normalizedPayload // 👈 supports object OR array
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error || "Access denied");
  }

  return data;
}
