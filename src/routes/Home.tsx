import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticlePreview from "../components/ArticlePreview";
import { Article } from "../Types/Article";

export default function Home(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<{ articles: Article[] }>(
          "https://api.realworld.io/api/articles"
        );
        setArticles(response.data.articles);
      } catch (error) {
        setError("Failed to fetch articles.");
      }
    };

    fetchArticles();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <Navbar />

      <Banner />

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link" href="">
                    Your Feed
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="">
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>

            {isLoading ? (
              <div>Loading articles...</div>
            ) : (
              <>
                {articles.map((article) => (
                  <ArticlePreview key={article.slug} article={article} />
                ))}

                <ul className="pagination">
                  <li className="page-item active">
                    <a className="page-link" href="">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="">
                      2
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                <a href="" className="tag-pill tag-default">
                  programming
                </a>
                <a href="" className="tag-pill tag-default">
                  javascript
                </a>
                <a href="" className="tag-pill tag-default">
                  emberjs
                </a>
                <a href="" className="tag-pill tag-default">
                  angularjs
                </a>
                <a href="" className="tag-pill tag-default">
                  react
                </a>
                <a href="" className="tag-pill tag-default">
                  mean
                </a>
                <a href="" className="tag-pill tag-default">
                  node
                </a>
                <a href="" className="tag-pill tag-default">
                  rails
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
