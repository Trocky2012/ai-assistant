// src/pages/AiKnowledge/sections/Experiences.jsx
import { useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import { addExperience } from "../../../../api/ExperiencesApi";


const DEFAULT_JSON = `{
  "company": "Company Name",
  "position": "Your Position",
  "startDate": "DD/MM/YYYY",
  "endDate": "DD/MM/YYYY",
  "description": "Description (long text)"
}`;

export default function Experiences({ userId, email, jsonData }) {
    const [form, setForm] = useState({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    // const [rawJson, setRawJson] = useState(DEFAULT_JSON);
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
    }, [userId, email]); // ✅ ALWAYS same size


    /* -------------------- SUBMIT -------------------- */
    async function handleSubmit() {
        try {
            await addExperience({
                userId,
                email,
                jsonData,
                rawJson,
                form
            });

            setAlert({
                type: "success",
                message: "Experience saved successfully.",
                duration: 2
            });

            // ✅ reset form
            setForm({
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: ""
            });

            // ✅ reset JSON editor
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
            <h3>Professional Experience</h3>

            {/* Alert */}
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* RAW JSON MODE */}
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
                        placeholder="Company"
                        value={form.company}
                        onChange={(e) =>
                            setForm({ ...form, company: e.target.value })
                        }
                        disabled={!canEdit}
                    />

                    <input
                        placeholder="Position"
                        value={form.position}
                        onChange={(e) =>
                            setForm({ ...form, position: e.target.value })
                        }
                        disabled={!canEdit}
                    />

                    <input
                        placeholder="Start Date"
                        value={form.startDate}
                        onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                        }
                        disabled={!canEdit}
                    />

                    <input
                        placeholder="End Date"
                        value={form.endDate}
                        onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                        }
                        disabled={!canEdit}
                    />

                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        rows={5}
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
