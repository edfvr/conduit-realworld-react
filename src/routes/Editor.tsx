import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function Editor(): JSX.Element {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  /**
   * Fetches an article from RealWOrld API
   *   using slug provided
   */
  const fetchArticle = async () => {
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      //if successful, extract article from the response, then update state
      if (response.ok) {
        const { article } = await response.json();
        setTitle(article.title);
        setDescription(article.description);
        setBody(article.body);
        setTagList(article.tagList);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  /**
   * Handles form submission for creating
   *  or updating an article
   * @param e Form event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    //check if fields are not filled
    if (!title || !description || !body) {
      setErrors(["Please fill in all required fields"]);
      return;
    }

    //method to use; if we creating POST, if updating PUT
    const method = slug ? "PUT" : "POST";

    // url if we are creating or updating
    const url = slug
      ? `https://api.realworld.io/api/articles/${slug}`
      : "https://api.realworld.io/api/articles";

    try {
      //fetch method, header and body
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        //Convert data fetched into JSON
        body: JSON.stringify({
          article: {
            title,
            description,
            body,
            tagList,
          },
        }),
      });

      // if success extract the response
      if (response.ok) {
        const data = await response.json();
        navigate(`/article/${data.article.slug}`);
      } else {
        const errorData = await response.json();
        setErrors(Object.values(errorData.errors).flat() as string[]);
      }
    } catch (error) {
      setErrors(["An unexpected error occurred. Please try again."]);
    }
  };

  /**
   * Handles adding a tag to the tag list
   *  when the Enter key is pressed.
   * @param e - The keyboard event from the input field.
   */
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!tagList.includes(tagInput)) {
        setTagList([...tagList, tagInput]);
      }
      setTagInput("");
    }
  };

  /**
   * Handles removing a tag from the tag list.
   * @param tag The tag string to be removed.
   */
  const removeTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  return (
    <>
      <Navbar />
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
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
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={addTag}
                    />
                    <div className="tag-list">
                      {tagList.map((tag) => (
                        <span key={tag} className="tag-default tag-pill">
                          <i
                            className="ion-close-round"
                            onClick={() => removeTag(tag)}
                          ></i>{" "}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="submit"
                  >
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
