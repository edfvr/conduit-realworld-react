import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleList from "../components/ArticleList";
import FeedToggle from "../components/FeedToggle";
import TagList from "../components/TagList";

export default function Home(): JSX.Element {
  return (
    <div className="home-page">
      <Navbar />
      <Banner />
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle />
            <ArticleList />
          </div>
          <div className="col-md-3">
            <TagList />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
