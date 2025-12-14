// src/pages/AiKnowledge/AiKnowledge.jsx
import { useState } from "react";
import "./AiKnowledge.css";

import Header from "../../static/Header";

import Basics from "./sections/Basics/Basics";
import Experiences from "./sections/Experiences/Experiences";
import Projects from "./sections/Projects/Projects";
import Strengths from "./sections/Strengths/Strengths";
import Education from "./sections/Education/Education";

const SECTIONS = [
    { key: "basics", label: "Basics" },
    { key: "experiences", label: "Experiences" },
    { key: "projects", label: "Projects" },
    { key: "strengths", label: "Strengths" },
    { key: "education", label: "Education" }
];

export default function AiKnowledge({ userId, email, onLogout, onBack }) {
    const [active, setActive] = useState("basics");
    const [jsonData, setJsonData] = useState(false);

    function renderSection() {
        const commonProps = { userId, email, jsonData };

        switch (active) {
            case "basics":
                return <Basics {...commonProps} />;
            case "experiences":
                return <Experiences {...commonProps} />;
            case "projects":
                return <Projects {...commonProps} />;
            case "strengths":
                return <Strengths {...commonProps} />;
            case "education":
                return <Education {...commonProps} />;
            default:
                return null;
        }
    }

    return (
        <div className="ai-knowledge-root">
            <Header onLogout={onLogout} onBack={onBack} hideAiKnowledge />

            <div className="ai-knowledge-page">
                {/* Sidebar */}
                <aside className="ai-knowledge-sidebar">
                    <h1>Ai Chat Knowledge</h1>
                    {SECTIONS.map((s) => (
                        <button
                            key={s.key}
                            className={`ai-knowledge-tab ${active === s.key ? "active" : ""}`}
                            onClick={() => setActive(s.key)}
                        >
                            {s.label}
                        </button>
                    ))}
                </aside>

                {/* Main */}
                <div className="ai-knowledge-main">
                    <div className="ai-knowledge-container">
                        {/* Toolbar */}
                        <div className="ai-knowledge-toolbar">
                            <div className="segmented-control">
                                <button
                                    className={!jsonData ? "active" : ""}
                                    onClick={() => setJsonData(false)}
                                >
                                    Advanced
                                </button>
                                <button
                                    className={jsonData ? "active" : ""}
                                    onClick={() => setJsonData(true)}
                                >
                                    Raw JSON
                                </button>
                            </div>
                        </div>

                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
}
