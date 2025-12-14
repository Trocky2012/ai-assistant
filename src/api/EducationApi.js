// src/api/EducationApi.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function normalizeEducationPayload({ jsonData, rawJson, form }) {
  if (jsonData) {
    const parsed = JSON.parse(rawJson);
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  return [
    {
      institution: form.institution.trim(),
      course: form.course.trim(),
      level: form.level.trim(),
      country: form.country.trim(),
      duration: form.duration.trim()
    }
  ];
}

export async function addEducation({
  userId,
  email,
  jsonData,
  rawJson,
  form
}) {
  const items = normalizeEducationPayload({ jsonData, rawJson, form });

  for (const item of items) {
    const res = await fetch(`${API_BASE_URL}add-education`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email,
        ...item
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.error || "Failed to save education");
    }
  }
}
