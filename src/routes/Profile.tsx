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
  }, [username, isAuthenticated]);

  /**
   * Fetches the profile data for the specified username.
   */
  const fetchProfile = async () => {
    try {
      const headers = isAuthenticated
        ? { Authorization: `Token ${localStorage.getItem("token")}` }
        : {};
      const response = await axios.get(
        `https://api.realworld.io/api/profiles/${username}`,
        { headers }
      );
      //Update state
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  /**
   * Fetches articles authored by the specified username.
   */
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

  /**
   * Fetches articles favorited by the specified username.
   */
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

  /**
   * Toggles the follow status of a user.
   */
  const handleFollow = async () => {
    //Exit the function if the user is not authenticated
    if (!isAuthenticated) {
      console.log("You need to be logged in to follow a user");
      return;
    }

    // Exit the function if the profile data is not available
    if (!profile) {
      console.error("Profile data is not available");
      return;
    }

    try {
      // Determine the HTTP method based on whether the profile is currently being followed
      const method = profile.following ? "delete" : "post";
      //request to the API to follow or unfollow the user
      const response = await axios({
        method,
        url: `https://api.realworld.io/api/profiles/${username}/follow`,
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      // Extract the updated profile from the response
      const updatedProfile = response.data.profile;
      // Update the profile state with the new follow status
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  /**
   * Toggles the favorite status of an article.
   * @param article The article to toggle the favorite status for.
   * @returns The updated article, or null if an error occurs.
   */
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

      if (activeTab === "favorited") {
        // Remove the article from favoritedArticles if it was unfavorited
        if (!updatedArticle.favorited) {
          setFavoritedArticles((prevFavorited) =>
            prevFavorited.filter((a) => a.slug !== updatedArticle.slug)
          );
        }
      } else {
        // Update the article in the articles list
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a.slug === updatedArticle.slug ? updatedArticle : a
          )
        );
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
                {isAuthenticated && user?.username !== profile?.username && (
                  <button
                    className="btn btn-sm btn-outline-secondary action-btn"
                    onClick={handleFollow}
                    disabled={!isAuthenticated || !profile}
                  >
                    <i
                      className={
                        profile?.following
                          ? "ion-minus-round"
                          : "ion-plus-round"
                      }
                    ></i>
                    &nbsp; {profile?.following ? "Unfollow" : "Follow"}{" "}
                    {profile?.username}
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
