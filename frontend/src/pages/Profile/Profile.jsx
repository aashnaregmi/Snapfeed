import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeedNavbar from "../Feed/FeedComponent/FeedNavbar";
import "./Profile.css";

const API_URL = "http://127.0.0.1:8000";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    name: "",
    username: localStorage.getItem("username") || "",
    email: "",
    bio: "",
  });

  const username = user.username;
  const name = user.name || username || "User";

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Please log in to view your profile.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileResponse, postsResponse] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/myuploads`, { headers }),
        ]);

        const profileData = await profileResponse.json();
        const postsData = await postsResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.detail || "Unable to load your profile.");
        }

        setUser(profileData);

        localStorage.setItem("name", profileData.name || "");
        localStorage.setItem("username", profileData.username || "");

        if (postsResponse.ok) {
          setPosts(Array.isArray(postsData) ? postsData : []);
        } else if (postsResponse.status === 404) {
          setPosts([]);
        } else {
          throw new Error(postsData.detail || "Unable to load your posts.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  const handleShare = async () => {
    const profileUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} on SnapFeed`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Unable to share your profile.");
      }
    }
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        <section className="profile-header">
          <div className="profile-avatar-large">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-details">
            <h1>{name}</h1>
            <p className="profile-username">@{username}</p>
            <p className="profile-bio">
              {user.bio || "Add a short bio to make your profile your own ✨"}
            </p>
          </div>
        </section>

        <div className="profile-actions">
          <button
            type="button"
            className="profile-button profile-edit-button"
            onClick={() => alert("Edit profile is coming soon!")}
          >
            Edit profile
          </button>

          <button
            type="button"
            className="profile-button profile-share-button"
            onClick={handleShare}
          >
            Share profile
          </button>
        </div>

        <Link to="/upload" className="profile-upload-card">
          <svg
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="14" height="16" rx="2" />
            <circle cx="8" cy="10" r="1.5" />
            <path d="m5 18 5-5 3 3 2-2" />
            <path d="M19 2v6M16 5h6" />
          </svg>

          <h2>Upload a post</h2>
          <p>Share a moment with the world</p>
        </Link>

        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === "created" ? "active" : ""}`}
            onClick={() => setActiveTab("created")}
          >
            <span className="profile-tab-icon">▦</span>
            <span>Created</span>
          </button>
        </div>

        {loading && <p className="profile-message">Loading your profile...</p>}

        {!loading && error && (
          <p className="profile-message profile-error">{error}</p>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="profile-empty">
            <span className="profile-empty-icon">▧</span>
            <h2>Your story starts here</h2>
            <p>Posts you create will appear here.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="profile-post-grid">
            {posts.map((post) => {
              const imageUrl = post.media_url || post.url;

              return (
                <article className="profile-post" key={post.id}>
                  {imageUrl ? (
                    <img
                      src={`${API_URL}${imageUrl}`}
                      alt={post.caption || "SnapFeed post"}
                      loading="lazy"
                      onError={(e) => {
                        console.error(
                          "Failed to load profile image:",
                          e.currentTarget.src,
                        );
                      }}
                    />
                  ) : (
                    <p className="profile-error">
                      Image URL is missing for this post.
                    </p>
                  )}

                  {post.caption && (
                    <p className="profile-post-caption">{post.caption}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
