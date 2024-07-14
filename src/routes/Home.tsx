import { useState } from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleList from "../components/ArticleList";
import FeedToggle from "../components/FeedToggle";
import TagList from "../components/TagList";
import { useAuth } from "../contexts/AuthContext";
import { Article } from "../Types/Article";
import axios from "axios";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"your" | "global" | "tag">(
    "global"
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab("tag");
  };

  const handleFavoriteToggle = async (article: Article) => {
    try {
      const method = article.favorited ? "delete" : "post";
      const response = await axios({
        method,
        url: `https://api.realworld.io/api/articles/${article.slug}/favorite`,
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      const updatedArticle = response.data.article;
      // The ArticleList component will handle updating its own state
      return updatedArticle;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return null;
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      <Banner />
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedTag={selectedTag}
              isAuthenticated={isAuthenticated}
            />
            <ArticleList
              activeTab={activeTab}
              selectedTag={selectedTag}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
          <div className="col-md-3">
            <TagList onTagSelect={handleTagSelect} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
