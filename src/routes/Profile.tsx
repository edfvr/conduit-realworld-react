import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ArticleList from "../components/ArticleList";
import { Article } from "../Types/Article";
import axios from "axios";

interface ProfileData {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"my" | "favorited">("my");
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoritedArticles, setFavoritedArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchArticles();
    fetchFavoritedArticles();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `https://api.realworld.io/api/profiles/${username}`
      );
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `https://api.realworld.io/api/articles?author=${username}`
      );
      setArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchFavoritedArticles = async () => {
    try {
      const response = await axios.get(
        `https://api.realworld.io/api/articles?favorited=${username}`
      );
      setFavoritedArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching favorited articles:", error);
    }
  };

  const handleFollow = async () => {
    // Implement follow/unfollow logic here
  };

  const handleFavoriteToggle = async (
    article: Article
  ): Promise<Article | null> => {
    try {
      const method = article.favorited ? "delete" : "post";
      const response = await axios({
        method,
        url: `https://api.realworld.io/api/articles/${article.slug}/favorite`,
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      const updatedArticle = response.data.article;

      if (activeTab === "my") {
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a.slug === updatedArticle.slug ? updatedArticle : a
          )
        );
      } else {
        setFavoritedArticles((prevFavorited) => {
          if (updatedArticle.favorited) {
            return [...prevFavorited, updatedArticle];
          } else {
            return prevFavorited.filter((a) => a.slug !== updatedArticle.slug);
          }
        });
      }

      return updatedArticle;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return null;
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  src={profile.image}
                  className="user-img"
                  alt={profile.username}
                />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>
                {isAuthenticated && user?.username !== profile.username && (
                  <button
                    className="btn btn-sm btn-outline-secondary action-btn"
                    onClick={handleFollow}
                  >
                    <i className="ion-plus-round"></i>
                    &nbsp; {profile.following ? "Unfollow" : "Follow"}{" "}
                    {profile.username}
                  </button>
                )}
                {isAuthenticated && user?.username === profile.username && (
                  <Link
                    to="/settings"
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <i className="ion-gear-a"></i>
                    &nbsp; Edit Profile Settings
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "my" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("my")}
                    >
                      My Articles
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "favorited" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("favorited")}
                    >
                      Favorited Articles
                    </button>
                  </li>
                </ul>
              </div>

              <ArticleList
                key={activeTab}
                activeTab={activeTab}
                selectedTag={null}
                username={profile.username}
                favorited={activeTab === "favorited"}
                articles={activeTab === "my" ? articles : favoritedArticles}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
