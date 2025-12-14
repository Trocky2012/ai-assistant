// src/pages/AiKnowledge/sections/Education/Education.jsx
import { useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import { addEducation } from "../../../../api/EducationApi";

const DEFAULT_JSON = `{
  "institution": "University / School Name",
  "course": "Course or Program Name",
  "level": "Bachelor / Master / PhD / Certificate",
  "country": "Country",
  "duration": "YYYY - YYYY"
}`;

export default function Education({ userId, email, jsonData }) {
  const [form, setForm] = useState({
    institution: "",
    course: "",
    level: "",
    country: "",
    duration: ""
  });

  const [rawJson, setRawJson] = useState("");
  const [alert, setAlert] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  /* -------------------- CHECK PERMISSION -------------------- */
  useEffect(() => {
    if (!email) {
      setCanEdit(false);
      return;
    }

    async function checkAccess() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}check-user-credentials`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId || null,
              email
            })
          }
        );

        const data = await res.json();

        if (res.ok && data.success && data.canEdit) {
          setCanEdit(true);
          setAlert(null);
        } else {
          setCanEdit(false);
          setAlert({
            type: "info",
            message:
              "You can explore this AI Knowledge section, but only the product owner can make changes."
          });
        }
      } catch {
        setCanEdit(false);
        setAlert({
          type: "info",
          message:
            "You can explore this AI Knowledge section, but only the product owner can make changes."
        });
      }
    }

    checkAccess();
  }, [userId, email]);

  /* -------------------- SUBMIT -------------------- */
  async function handleSubmit() {
    try {
      await addEducation({
        userId,
        email,
        jsonData,
        rawJson,
        form
      });

      setAlert({
        type: "success",
        message: "Education saved successfully.",
        duration: 2
      });

      setForm({
        institution: "",
        course: "",
        level: "",
        country: "",
        duration: ""
      });

      setRawJson("");
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Invalid JSON format."
      });
    }
  }

  return (
    <div className="ai-knowledge-section">
      <h3>Education</h3>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}

      {jsonData ? (
        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          rows={14}
          disabled={!canEdit}
          placeholder={DEFAULT_JSON}
        />
      ) : (
        <>
          <input
            placeholder="Institution"
            value={form.institution}
            onChange={(e) =>
              setForm({ ...form, institution: e.target.value })
            }
            disabled={!canEdit}
          />

          <input
            placeholder="Course"
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
            disabled={!canEdit}
          />

          <input
            placeholder="Level"
            value={form.level}
            onChange={(e) =>
              setForm({ ...form, level: e.target.value })
            }
            disabled={!canEdit}
          />

          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
            disabled={!canEdit}
          />

          <input
            placeholder="Duration"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
            disabled={!canEdit}
          />
        </>
      )}

      <button
        className="primary-btn apple-btn"
        onClick={handleSubmit}
        disabled={!canEdit}
      >
        Save
      </button>
    </div>
  );
}
