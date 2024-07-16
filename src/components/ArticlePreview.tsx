import { Link } from "react-router-dom";
import { Article } from "../Types/Article";

interface ArticlePreviewProps {
  article: Article;
  onFavoriteToggle: () => void;
  isFavoritedView?: boolean;
}

export default function ArticlePreview({
  article,
  onFavoriteToggle,
  isFavoritedView = false,
}: ArticlePreviewProps): JSX.Element {
  const isFavorited = article.favorited || isFavoritedView;

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
          className={`btn btn-sm pull-xs-right ${
            isFavorited ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={onFavoriteToggle}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
