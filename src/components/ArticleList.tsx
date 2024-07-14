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
  }, [
    activeTab,
    selectedTag,
    username,
    favorited,
    propArticles,
    currentPage,
    token,
  ]);

  /**
   * Fetches articles from the API
   */
  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      let url = "https://api.realworld.io/api/articles";
      const params: Record<string, string> = {
        limit: ARTICLES_PER_PAGE.toString(),
        // starting point of articles = the current page - 1 * the number of articles per page
        offset: ((currentPage - 1) * ARTICLES_PER_PAGE).toString(),
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // if Your feed is the active tab and user is authenticated
      if (activeTab === "your" && token) {
        url = "https://api.realworld.io/api/articles/feed";
        //view personalized feed of articles based on follow
        headers.Authorization = `Token ${token}`;

        // If ta tag is selected
      } else if (activeTab === "tag" && selectedTag) {
        // Filter the articles by selected tag
        params.tag = selectedTag;

        //if user is logged in
      } else if (username) {
        //If viewing favorited articles
        if (favorited) {
          // fetch articles that have been favorited by the user
          params.favorited = username;
        } else {
          //fetch articles authored by the user
          params.author = username;
        }
      }

      //If logged in, include the user's authentication token in the Authorization header
      if (token) {
        headers.Authorization = `Token ${token}`;
      }

      console.log("Fetching articles with:", { url, params, headers });

      //Fetch article and count data
      const response = await axios.get<{
        articles: Article[];
        articlesCount: number;
      }>(url, { params, headers });

      console.log("Received articles:", response.data.articles);

      setArticles(response.data.articles);
      setArticlesCount(response.data.articlesCount);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Failed to fetch articles: ${
            error.response.data.errors?.body || "Unknown error"
          }`
        );
        console.error("Error fetching articles:", error.response.data);
      } else {
        setError("An unexpected error occurred while fetching articles.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the favorite (or unfavorite) action for an article
   * @param article The article object to toggle favorite status.
   * @returns {Promise<void>} A Promise that resolves
   *  once the favorite action is handled.
   */
  const handleFavorite = async (article: Article) => {
    //return an updated version of the article with its favorite status toggled.
    const updatedArticle = await onFavoriteToggle(article);
    //if the article was successfully updated (toggled)
    if (updatedArticle) {
      setArticles((prevArticles) =>
        // Map through the previous articles state to update the specific article.
        prevArticles.map((a) =>
          // If the article slug matches the updated article's slug, replace it with the updated version.
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
          isFavoritedView={favorited}
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
