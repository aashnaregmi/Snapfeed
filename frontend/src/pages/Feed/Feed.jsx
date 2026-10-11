import FeedNavbar from "./FeedComponent/FeedNavbar";
import FeedHero from "./FeedComponent/FeedHero";
import "./Feed.css";

function Feed() {
  return (
    <main className="feed-page">
      <div className="feed-container">
        <FeedNavbar />
        <FeedHero />
      </div>
    </main>
  );
}

export default Feed;
