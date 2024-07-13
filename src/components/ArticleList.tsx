import { useState, useEffect } from "react";
import axios from "axios";
import ArticlePreview from "./ArticlePreview";
import { Article } from "../Types/Article";

interface ArticleListProps {
  selectedTag: string | null;
}

export default function ArticleList({
  selectedTag,
}: ArticleListProps): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const ARTICLES_PER_PAGE = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        let url = `https://api.realworld.io/api/articles?limit=${ARTICLES_PER_PAGE}&offset=${
          (currentPage - 1) * ARTICLES_PER_PAGE
        }`;
        if (selectedTag) {
          url += `&tag=${selectedTag}`;
        }
        const response = await axios.get<{
          articles: Article[];
          articlesCount: number;
        }>(url);
        setArticles(response.data.articles);
        setArticlesCount(response.data.articlesCount);
      } catch (error) {
        setError("Failed to fetch articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedTag]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading articles...</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
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
