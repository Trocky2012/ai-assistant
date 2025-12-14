// src/pages/AiKnowledge/sections/Experiences.jsx
import { useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";

const DEFAULT_JSON = `{
  "company": "Company test name",
  "position": "Developer",
  "startDate": "01/02/2025",
  "endDate": "13/09/2025",
  "description": "Long text description with possible many lines"
}`;

export default function Experiences({ userId, email, advanced }) {
    const [form, setForm] = useState({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    const [rawJson, setRawJson] = useState(DEFAULT_JSON);
    const [alert, setAlert] = useState(null);
    const [canEdit, setCanEdit] = useState(false);

    /* -------------------- CHECK PERMISSION -------------------- */
    useEffect(() => {
        // email = "thiagotrollec@gmail.com";
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
            const payload = advanced
                ? JSON.parse(rawJson)
                : {
                    company: form.company.trim(),
                    position: form.position.trim(),
                    startDate: form.startDate,
                    endDate: form.endDate || null,
                    description: form.description.trim()
                };

            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}add-experience`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        email,
                        ...payload
                    })
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data?.error || "Access denied");
            }

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

            // ✅ reset JSON editor (optional)
            setRawJson(DEFAULT_JSON);
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
            {advanced ? (
                <textarea
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    rows={14}
                    disabled={!canEdit}
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
                Save Experience
            </button>
        </div>
    );
}
