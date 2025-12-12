import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut } from "react-feather";
import "./Assistant.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Assistant({ onLogout }) {
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Welcome message (language-aware)
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: t("assistant.welcome")
      }
    ]);
  }, [i18n.language, t]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();

      if (!data.success) throw new Error();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("assistant.error") }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="assistant-page">
      {/* Header */}
      <header className="assistant-header">
        <div className="assistant-container assistant-header-inner">
          <h2>{t("assistant.title")}</h2>

          <button
            className="assistant-logout"
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>


      {/* Chat */}
      <div className="assistant-chat">
        <div className="assistant-container assistant-chat-inner">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`assistant-bubble ${msg.role}`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="assistant-bubble assistant">
              {t("assistant.thinking")}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="assistant-input-bar">
        <div className="assistant-container assistant-input-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("assistant.placeholder")}
            rows={1}
          />
          <button onClick={handleSend} disabled={loading}>
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
