import { useState, useEffect } from "react";
import axios from "axios";
import ArticlePreview from "./ArticlePreview";
import { Article } from "../Types/Article";
import { useAuth } from "../contexts/AuthContext";

interface ArticleListProps {
  activeTab: "your" | "global" | "tag" | "my" | "favorited";
  selectedTag: string | null;
  username?: string;
  favorited?: boolean;
  articles?: Article[];
  onFavoriteToggle: (article: Article) => Promise<Article | null>;
}

export default function ArticleList({
  activeTab,
  selectedTag,
  username,
  favorited,
  articles: propArticles,
  onFavoriteToggle,
}: ArticleListProps): JSX.Element {
  const [articles, setArticles] = useState<Article[]>(propArticles || []);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const ARTICLES_PER_PAGE = 10;
  const { token } = useAuth();

  useEffect(() => {
    if (propArticles) {
      setArticles(propArticles);
      setIsLoading(false);
    } else {
      fetchArticles();
    }
  }, [activeTab, selectedTag, username, favorited, propArticles, currentPage]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      let url = "https://api.realworld.io/api/articles";
      const params: Record<string, string> = {
        limit: ARTICLES_PER_PAGE.toString(),
        offset: ((currentPage - 1) * ARTICLES_PER_PAGE).toString(),
      };

      if (activeTab === "your" && token) {
        url = "https://api.realworld.io/api/articles/feed";
      } else if (activeTab === "tag" && selectedTag) {
        params.tag = selectedTag;
      } else if (username) {
        if (favorited) {
          params.favorited = username;
        } else {
          params.author = username;
        }
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Token ${token}`;
      }

      const response = await axios.get<{
        articles: Article[];
        articlesCount: number;
      }>(url, { params, headers });
      setArticles(response.data.articles);
      setArticlesCount(response.data.articlesCount);
    } catch (error) {
      setError("Failed to fetch articles.");
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async (article: Article) => {
    const updatedArticle = await onFavoriteToggle(article);
    if (updatedArticle) {
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.slug === updatedArticle.slug ? updatedArticle : a
        )
      );
    }
  };

  if (isLoading) {
    return <div>Loading articles...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div>No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          onFavoriteToggle={() => handleFavorite(article)}
        />
      ))}
      <ul className="pagination">
        {Array.from({
          length: Math.ceil(articlesCount / ARTICLES_PER_PAGE),
        }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
