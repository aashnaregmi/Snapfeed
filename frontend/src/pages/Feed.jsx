import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.log("Error loading posts:", error);
      });
  }, []);

  return (
    <div className="feed">
      <h1>SnapFeed</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
