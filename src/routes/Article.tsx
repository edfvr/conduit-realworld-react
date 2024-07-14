import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Article as ArticleType, Comment } from "../Types/Article";
import { useAuth } from "../contexts/AuthContext";

export default function Article(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [comment, setComment] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://api.realworld.io/api/articles/${slug}`,
          {
            headers: token ? { Authorization: `Token ${token}` } : {},
          }
        );
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [slug, token]);

  if (!article) {
    return <div>Loading...</div>;
  }

  const isAuthor = user && user.username === article.author.username;

  const handleEdit = () => {
    navigate(`/editor/${article.slug}`);
  };

  /**
   *
   */
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const response = await fetch(
          `https://api.realworld.io/api/articles/${article.slug}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (response.ok) {
          navigate("/");
        } else {
          console.error("Failed to delete article");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  /**
   *
   * @param e
   * @returns
   */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${article.slug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ comment: { body: comment } }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setArticle({
          ...article,
          comments: [data.comment, ...(article.comments || [])],
        });
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  /**
   * Handles deletion of a comment from an article.
   * @param commentId The ID of the comment to delete.
   */
  const handleCommentDelete = async (commentId: number) => {
    try {
      // Send a DELETE request
      const response = await fetch(
        `https://api.realworld.io/api/articles/${article.slug}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // If delete was a success, update the article state by excluding the deleted comment from the comments array.
      if (response.ok) {
        setArticle({
          ...article,
          comments: article.comments?.filter((c) => c.id !== commentId) || [],
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">
                  {new Date(article.createdAt).toDateString()}
                </span>
              </div>
              {isAuthor ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleEdit}
                  >
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDelete}
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-plus-round"></i>
                    &nbsp; Follow {article.author.username}
                  </button>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="ion-heart"></i>
                    &nbsp; Favorite Article{" "}
                    <span className="counter">({article.favoritesCount})</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{article.body}</p>
              <ul className="tag-list">
                {article.tagList.map((tag) => (
                  <li key={tag} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">
                  {new Date(article.createdAt).toDateString()}
                </span>
              </div>
              {isAuthor ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleEdit}
                  >
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDelete}
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-plus-round"></i>
                    &nbsp; Follow {article.author.username}
                  </button>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="ion-heart"></i>
                    &nbsp; Favorite Article{" "}
                    <span className="counter">({article.favoritesCount})</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form
                className="card comment-form"
                onSubmit={handleCommentSubmit}
              >
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img
                    src={user?.image || "http://i.imgur.com/Qr71crq.jpg"}
                    className="comment-author-img"
                    alt="User"
                  />
                  <button className="btn btn-sm btn-primary" type="submit">
                    Post Comment
                  </button>
                </div>
              </form>

              {article.comments &&
                article.comments.map((comment: Comment) => (
                  <div key={comment.id} className="card">
                    <div className="card-block">
                      <p className="card-text">{comment.body}</p>
                    </div>
                    <div className="card-footer">
                      <Link
                        to={`/profile/${comment.author.username}`}
                        className="comment-author"
                      >
                        <img
                          src={comment.author.image}
                          className="comment-author-img"
                          alt={comment.author.username}
                        />
                      </Link>
                      &nbsp;
                      <Link
                        to={`/profile/${comment.author.username}`}
                        className="comment-author"
                      >
                        {comment.author.username}
                      </Link>
                      <span className="date-posted">
                        {new Date(comment.createdAt).toDateString()}
                      </span>
                      {user && user.username === comment.author.username && (
                        <span
                          className="mod-options"
                          onClick={() => handleCommentDelete(comment.id)}
                        >
                          <i className="ion-trash-a"></i>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
