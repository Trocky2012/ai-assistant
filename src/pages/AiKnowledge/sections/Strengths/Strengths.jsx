// src/pages/AiKnowledge/sections/Strengths/Strengths.jsx
import { useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import {
  getStrengths,
  addStrength,
  deleteStrength,
  addStrengthsFromJson
} from "../../../../api/StrengthsApi";

const DEFAULT_JSON = `[
  { "key": "Problem Solving", "value": "Strong analytical and critical thinking skills" },
  { "key": "Communication", "value": "Clear communication with technical and non-technical teams" }
]`;

export default function Strengths({ userId, email, jsonData }) {
  const [items, setItems] = useState([]);
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [rawJson, setRawJson] = useState("");
  const [alert, setAlert] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  /* -------------------- LOAD -------------------- */
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getStrengths();
      setItems(data);
    } catch {
      setAlert({ type: "error", message: "Failed to load strengths" });
    }
  }

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
            body: JSON.stringify({ userId: userId || null, email })
          }
        );

        const data = await res.json();
        setCanEdit(res.ok && data.success && data.canEdit);
      } catch {
        setCanEdit(false);
      }
    }

    checkAccess();
  }, [userId, email]);

  /* -------------------- ADD (FORM) -------------------- */
  async function handleAdd() {
    try {
      await addStrength({
        userId,
        email,
        key: keyInput,
        value: valueInput
      });

      setKeyInput("");
      setValueInput("");
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  }

  /* -------------------- ADD (JSON) -------------------- */
  async function handleAddJson() {
    try {
      await addStrengthsFromJson({
        userId,
        email,
        rawJson
      });

      setRawJson("");
      load();

      setAlert({
        type: "success",
        message: "Strengths saved successfully",
        duration: 2
      });
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStrength({ userId, email, id });
      setItems(items.filter(i => i.id !== id));
    } catch {
      setAlert({ type: "error", message: "Delete failed" });
    }
  }

  return (
    <div className="ai-knowledge-section">
      <h3>Strengths</h3>

      {alert && (
        <Alert {...alert} onClose={() => setAlert(null)} />
      )}

      {/* JSON MODE */}
      {jsonData && canEdit && (
        <>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={10}
            placeholder={DEFAULT_JSON}
          />
          <button
            className="apple-btn primary"
            onClick={handleAddJson}
          >
            Save JSON
          </button>
        </>
      )}

      {/* FORM MODE */}
      {!jsonData && canEdit && (
        <div className="config-add">
          <input
            placeholder="Strength"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <input
            placeholder="Description"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
          <button
            className="apple-btn primary"
            onClick={handleAdd}
            disabled={!keyInput || !valueInput}
          >
            Add
          </button>
        </div>
      )}

      {items.length === 0 && (
        <p className="config-empty">No strengths added yet.</p>
      )}

      <div className="config-vars">
        {items.map(item => (
          <div key={item.id} className="config-row">
            <span className="config-key">{item.key}</span>
            <span className="config-value">{item.value}</span>

            {canEdit && (
              <button
                className="config-delete"
                onClick={() => handleDelete(item.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
