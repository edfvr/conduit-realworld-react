import { useAuth } from "../contexts/AuthContext";

interface FeedToggleProps {
  activeTab: "your" | "global" | "tag";
  setActiveTab: (tab: "your" | "global" | "tag") => void;
  selectedTag: string | null;
  isAuthenticated: boolean;
}

export default function FeedToggle({
  activeTab,
  setActiveTab,
  selectedTag,
  isAuthenticated,
}: FeedToggleProps): JSX.Element {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isAuthenticated && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "your" ? "active" : ""}`}
              onClick={() => setActiveTab("your")}
            >
              Your Feed
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "global" ? "active" : ""}`}
            onClick={() => setActiveTab("global")}
          >
            Global Feed
          </button>
        </li>
        {selectedTag && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "tag" ? "active" : ""}`}
              onClick={() => setActiveTab("tag")}
            >
              #{selectedTag}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
