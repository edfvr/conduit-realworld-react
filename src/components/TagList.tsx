import { useState, useEffect } from "react";
import axios from "axios";

export default function TagList(): JSX.Element {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get<{ tags: string[] }>(
          "https://api.realworld.io/api/tags"
        );
        setTags(response.data.tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {tags.map((tag) => (
          <a key={tag} href="" className="tag-pill tag-default">
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}
