function PostCard({ post }) {
  const date = new Date(post.created_at);

  return (
    <div className="post-card">
      <div className="post-header">
        <strong>{post.username}</strong>

        <span>
          {date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {post.media_type === "image" && (
        <img
          src={`http://127.0.0.1:8000${post.media_url}`}
          alt={post.caption || "Post"}
        />
      )}

      {post.media_type === "video" && (
        <video src={`http://127.0.0.1:8000${post.media_url}`} controls />
      )}

      {post.caption && <p className="caption">{post.caption}</p>}
    </div>
  );
}

export default PostCard;
