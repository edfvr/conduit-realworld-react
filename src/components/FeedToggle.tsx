import { useState } from "react";

export default function FeedToggle(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"your" | "global">("global");

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "your" ? "active" : ""}`}
            onClick={() => setActiveTab("your")}
          >
            Your Feed
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "global" ? "active" : ""}`}
            onClick={() => setActiveTab("global")}
          >
            Global Feed
          </button>
        </li>
      </ul>
    </div>
  );
}
