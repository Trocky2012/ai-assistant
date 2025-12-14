import { useState } from "react";
import { clearSession } from "./utils/authSession";
import Login from "./pages/Login/Login";
import Assistant from "./pages/Assistant/Assistant";
import AiKnowledge from "./pages/AiKnowledge/AiKnowledge";
import "./i18n";

export const PAGES = {
  LOGIN: "login",
  ASSISTANT: "assistant",
  AI_KNOWLEDGE: "ai_knowledge",
  FEEDBACK: "feedback"
};

export default function App() {
  const [page, setPage] = useState(PAGES.LOGIN);
  const [user, setUser] = useState(null);

  function handleLogin(userData) {
    setUser(userData);
    setPage(PAGES.ASSISTANT);
  }

  function handleLogout() {
    clearSession(); 
    setUser(null);
    setPage(PAGES.LOGIN);
  }

  function renderPage() {
    switch (page) {
      case PAGES.ASSISTANT:
        return (
          <Assistant
            userId={user?.userId}
            email={user?.email}
            onLogout={handleLogout}
            onAiKnowledge={() => setPage(PAGES.AI_KNOWLEDGE)}
            onFeedback={() => setPage(PAGES.FEEDBACK)}
          />
        );

      case PAGES.AI_KNOWLEDGE:
        return (
          <AiKnowledge
            userId={user?.userId}
            email={user?.email}
            onBack={() => setPage(PAGES.ASSISTANT)}
            onLogout={handleLogout}
          />
        );

      case PAGES.LOGIN:
      default:
        return <Login onLogin={handleLogin} />;
    }
  }

  return <div className="app-container">{renderPage()}</div>;
}
