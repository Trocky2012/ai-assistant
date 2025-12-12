import { useState } from "react";
import Login from "./pages/Login/Login";
import Assistant from "./pages/Assistant/Assistant";
import "./i18n";

const PAGES = {
  LOGIN: "login",
  ASSISTANT: "assistant"
};

export default function App() {
  const [page, setPage] = useState(PAGES.LOGIN);

  function renderPage() {
    switch (page) {
      case PAGES.ASSISTANT:
        return <Assistant onLogout={() => setPage(PAGES.LOGIN)} />;

      case PAGES.LOGIN:
      default:
        return <Login onLogin={() => setPage(PAGES.ASSISTANT)} />;
    }
  }

  return <div className="app-container">{renderPage()}</div>;
}
