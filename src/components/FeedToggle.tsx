import { useState } from "react";

interface FeedToggleProps {
  selectedTag: string | null;
}

export default function FeedToggle({
  selectedTag,
}: FeedToggleProps): JSX.Element {
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
            className={`nav-link ${
              activeTab === "global" && !selectedTag ? "active" : ""
            }`}
            onClick={() => setActiveTab("global")}
          >
            Global Feed
          </button>
        </li>
        {selectedTag && (
          <li className="nav-item">
            <button className="nav-link active">#{selectedTag}</button>
          </li>
        )}
      </ul>
    </div>
  );
}
