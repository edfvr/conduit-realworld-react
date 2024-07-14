import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Settings(): JSX.Element {
  //get user's details from authentication context
  const { user, setUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    //Load user's data into the form
    if (user) {
      setImage(user.image || ""); // If user.image is null or undefined, use an empty string
      setUsername(user.username || "");
      setBio(user.bio || "");
      setEmail(user.email || "");
    }
  }, [user]);

  /**
   * Handles form submission for updating user settings.
   *  Sends updated user data to the API and processes the response.
   * @param e The form event triggered by form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      // Send updated user data to the API
      const response = await fetch("https://api.realworld.io/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user: {
            image,
            username,
            bio,
            email,
            // Include password only if it's not empty
            password: password || undefined,
          },
        }),
      });

      // If update is successful, update user
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate(`/profile/${data.user.username}`);
      } else {
        //If API request fails, parse the error response
        const errorData = await response.json();
        // Extract error messages from the response and set them in state
        setErrors(
          Object.entries(errorData.errors).map(
            ([key, value]) => `${key} ${value}`
          )
        );
      }
    } catch (error) {
      console.error("Settings update error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    }
  };

  /**
   * Calls the loguot funcion from AuthContext
   *  and navigates user to the homepage
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              {errors.length > 0 && (
                <ul className="error-messages">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="Short bio about you"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </fieldset>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary pull-xs-right"
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
