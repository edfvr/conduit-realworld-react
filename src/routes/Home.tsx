import { useState } from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleList from "../components/ArticleList";
import FeedToggle from "../components/FeedToggle";
import TagList from "../components/TagList";
import { useAuth } from "../contexts/AuthContext";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"your" | "global" | "tag">(
    "global"
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [favoritedArticles, setFavoritedArticles] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab("tag");
  };

  const handleFavoriteToggle = (slug: string) => {
    setFavoritedArticles((prevFavoritedArticles) =>
      prevFavoritedArticles.includes(slug)
        ? prevFavoritedArticles.filter((article) => article !== slug)
        : [...prevFavoritedArticles, slug]
    );
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
              favoritedArticles={favoritedArticles}
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
