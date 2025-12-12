import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Login.css";

export default function Login({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const codeRef = useRef(null);

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1***$2");

  const handleContinue = () => {
    if (!email) return;
    // TODO: POST /send-login-code
    setShowModal(true);
    setTimeout(() => codeRef.current?.focus(), 300);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);

    if (/^[A-Z0-9]{6}$/.test(value)) {
      // TODO: POST /verify-login-code
      // TODO: Save email + code to Firebase
      onLogin?.();
    }
  };

  const onEnter = (e, action) => {
    if (e.key === "Enter") action();
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>{t("login.title")}</h1>

        <input
          type="email"
          placeholder={t("login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => onEnter(e, handleContinue)}
        />

        <button onClick={handleContinue} onKeyDown={(e) => onEnter(e, handleContinue)}>
          {t("login.continue")}
        </button>

      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p>{t("login.codeMessage", { email: maskedEmail })}</p>
            <input
              ref={codeRef}
              placeholder={t("login.codePlaceholder")}
              value={code}
              onChange={handleCodeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
