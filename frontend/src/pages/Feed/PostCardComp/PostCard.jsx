import { useState } from "react";

// Use the deployed backend URL for media
const API_URL = import.meta.env.VITE_API_URL;

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);
  const [saveCount, setSaveCount] = useState(post.save_count ?? 0);

  const commentCount = post.comment_count ?? 0;

  const username = post.username || post.user?.username || "SnapFeed user";

  const caption = post.caption?.trim() || "Just the moment.";

  const imageUrl = post.media_url ? `${API_URL}${post.media_url}` : "";

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const handleLike = () => {
    setLiked((previous) => !previous);
    setLikeCount((previous) => previous + (liked ? -1 : 1));
  };

  const handleComment = () => {
    alert("Comment feature is coming soon!");
  };

  const handleSave = () => {
    setSaved((previous) => !previous);
    setSaveCount((previous) => previous + (saved ? -1 : 1));
  };

  // Show counts only when they are between 1 and 3.
  const shouldShowCount = (count) => count >= 1 && count <= 3;

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

      {/* Post image */}
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

      {/* Caption and actions */}
      <div className="post-card-footer">
        <p className="post-caption" title={caption}>
          {caption}
        </p>

        <div className="post-card-actions">
          {/* Like button and count */}
          <div className="post-action-group">
            <button
              type="button"
              className={`post-action like-button ${liked ? "active" : ""}`}
              onClick={handleLike}
              aria-label={liked ? "Unlike post" : "Like post"}
              aria-pressed={liked}
            >
              <span className="action-icon">{liked ? "♥" : "♡"}</span>
            </button>

            {shouldShowCount(likeCount) && (
              <span className="action-count">{likeCount}</span>
            )}
          </div>

          {/* Comment button and count */}
          <div className="post-action-group">
            <button
              type="button"
              className="post-action comment-button"
              onClick={handleComment}
              aria-label="Comment on post"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              </svg>
            </button>

            {shouldShowCount(commentCount) && (
              <span className="action-count">{commentCount}</span>
            )}
          </div>

          {/* Save button and count */}
          <div className="post-action-group">
            <button
              type="button"
              className={`post-action save-button ${saved ? "active" : ""}`}
              onClick={handleSave}
              aria-label={saved ? "Unsave post" : "Save post"}
              aria-pressed={saved}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
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

            {shouldShowCount(saveCount) && (
              <span className="action-count">{saveCount}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
