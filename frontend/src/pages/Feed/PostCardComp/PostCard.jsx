import { useState } from "react";

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const username = post.username || post.user?.username || "SnapFeed user";

  const caption = post.caption?.trim() || "Just the moment.";

  const imageUrl = post.media_url
    ? `http://127.0.0.1:8000${post.media_url}`
    : "";

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="post-card">
      {/* Username and date */}
      <div className="post-card-header">
        <div className="post-user-avatar">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="post-user-info">
          <strong>{username}</strong>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Square image */}
      <div className="post-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={caption}
            className="post-image"
            loading="lazy"
          />
        ) : (
          <div className="post-media-placeholder">No image available</div>
        )}
      </div>

      {/* Caption on the left, actions on the right */}
      <div className="post-card-footer">
        <p className="post-caption" title={caption}>
          {caption}
        </p>

        <div className="post-card-actions">
          <button
            type="button"
            className={`post-action like-button ${liked ? "active" : ""}`}
            onClick={() => setLiked((previous) => !previous)}
            aria-label={liked ? "Unlike post" : "Like post"}
            aria-pressed={liked}
          >
            <span className="action-icon">{liked ? "♥" : "♡"}</span>
          </button>

          <button
            type="button"
            className={`post-action save-button ${saved ? "active" : ""}`}
            onClick={() => setSaved((previous) => !previous)}
            aria-label={saved ? "Unsave post" : "Save post"}
            aria-pressed={saved}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
