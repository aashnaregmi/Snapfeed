import { useEffect, useState } from "react";
import PostCard from "../../../components/PostCard";

function FeedBody() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch("http://127.0.0.1:8000/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Unable to load posts.");
        }

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed-body">
      {loading && <p className="feed-message">Loading moments...</p>}

      {!loading && error && <p className="feed-message form-error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="feed-empty">
          <h3>Your feed starts here.</h3>
          <p>Be the first to share a moment with the community.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="feed-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeedBody;
