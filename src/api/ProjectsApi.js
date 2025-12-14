// src/api/ProjectsApi.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function addProject({
  userId,
  email,
  jsonData,
  rawJson,
  form
}) {
  let payload;

  if (jsonData) {
    const parsed = JSON.parse(rawJson);

    // accept object OR array of objects
    payload = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    payload = [
      {
        projectName: form.projectName.trim(),
        technologies: form.technologies.trim(),
        duration: form.duration.trim(),
        description: form.description.trim()
      }
    ];
  }

  const res = await fetch(`${API_BASE_URL}add-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      email,
      projects: payload
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error || "Failed to save project");
  }

  return data;
}
