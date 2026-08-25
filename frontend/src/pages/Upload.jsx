import { useState } from "react";

function Upload({ goToFeed }) {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!username) {
      alert("Please enter your username");
      return;
    }

    const formData = new FormData();

    formData.append("username", username);
    formData.append("caption", caption);
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Status:", response.status);

      const text = await response.text();

      console.log("Backend response:", text);

      if (!response.ok) {
        throw new Error(text);
      }

      alert("Post submitted successfully! 🎉");

      goToFeed();
    } catch (error) {
      console.log("ERROR:", error);
      alert("Something went wrong while posting.");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="post-card">
        <h1>📸 SnapFeed</h1>

        <p className="subtitle">Share your moment</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
          />

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
