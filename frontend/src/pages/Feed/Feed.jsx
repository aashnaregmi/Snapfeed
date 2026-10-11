import FeedNavbar from "./FeedComponent/FeedNavbar";
import FeedHero from "./FeedComponent/FeedHero";
import FeedBody from "./FeedComponent/FeedBody";
import "./Feed.css";

function Feed() {
  return (
    <main className="feed-page">
      <div className="feed-container">
        <FeedHero />
        <FeedBody />
      </div>
    </main>
  );
}

export default Feed;
