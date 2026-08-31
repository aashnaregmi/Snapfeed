import { useEffect, useState } from "react";

function Upload({ goToFeed }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [myUploads, setMyUploads] = useState([]);

  // =========================
  // GET MY UPLOADS
  // =========================

  const loadMyUploads = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/my-files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // No uploads yet
        if (response.status === 404) {
          setMyUploads([]);
          return;
        }

        throw new Error(data.detail || "Failed to load uploads");
      }

      setMyUploads(data);
    } catch (error) {
      console.log("Error loading my uploads:", error);
    }
  };

  // Load uploads when page opens
  useEffect(() => {
    loadMyUploads();
  }, []);

  // =========================
  // UPLOAD
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("access_token");

    const formData = new FormData();

    formData.append("caption", caption);
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      alert("Post uploaded successfully! 🎉");

      setCaption("");
      setFile(null);

      // Refresh my uploads
      loadMyUploads();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div style={{ width: "100%", maxWidth: "700px" }}>
        {/* =========================
            UPLOAD BOX
        ========================= */}

        <div className="upload-card">
          <h1>📸 Upload</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload 🚀"}
            </button>
          </form>
        </div>

        {/* =========================
            MY UPLOADS
        ========================= */}

        <div className="feed">
          <h1>My Uploads 📂</h1>

          {myUploads.length === 0 ? (
            <p className="empty-message">You haven't uploaded anything yet.</p>
          ) : (
            myUploads.map((post) => (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <strong>My Post</strong>

                  <span>
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* IMAGE */}

                {post.media_type === "image" && (
                  <img
                    src={`http://127.0.0.1:8000${post.url}`}
                    alt={post.caption || "My upload"}
                  />
                )}

                {/* VIDEO */}

                {post.media_type === "video" && (
                  <video src={`http://127.0.0.1:8000${post.url}`} controls />
                )}

                {/* CAPTION */}

                {post.caption && <p className="caption">{post.caption}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
