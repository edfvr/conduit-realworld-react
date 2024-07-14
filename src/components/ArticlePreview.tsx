import { Article } from "../Types/Article";
import { Link } from "react-router-dom";

interface ArticlePreviewProps {
  article: Article;
  onFavoriteToggle: (slug: string, favorited: boolean) => void;
}

export default function ArticlePreview({
  article,
  onFavoriteToggle,
}: ArticlePreviewProps): JSX.Element {
  const handleFavoriteClick = () => {
    onFavoriteToggle(article.slug, !article.favorited);
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image} alt={article.author.username} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>
        <button
          className={`btn btn-sm ${
            article.favorited ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={handleFavoriteClick}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
