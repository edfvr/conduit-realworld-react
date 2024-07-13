interface ArticlePreviewProps {
  article: {
    slug: string;
    title: string;
    description: string;
    author: {
      username: string;
      image: string;
    };
    createdAt: string;
    favoritesCount: number;
    tagList: string[];
  };
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div className="article-preview" key={article.slug}>
      <div className="article-meta">
        <a href={`/profile/${article.author.username}`}>
          <img src={article.author.image} alt={article.author.username} />
        </a>
        <div className="info">
          <a href={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </a>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <a href={`/article/${article.slug}`} className="preview-link">
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
      </a>
    </div>
  );
};

export default ArticlePreview;
