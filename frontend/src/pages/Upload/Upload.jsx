// Upload.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import "./Upload.css";
import FeedNavbar from "../Feed/FeedComponent/FeedNavbar";

function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please select a JPG, PNG, or WEBP image.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handlePublish = async () => {
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to publish post.");
      }

      setMessage("Post published successfully!");
      setFile(null);
      setCaption("");
      navigate("/profile");
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <div className="upload-container">
        <section className="upload-header">
          <h1>
            Share your moment<span> .</span>
          </h1>

          <p className="upload-description">
            Every picture has a story. Here's your space to tell yours.
          </p>
        </section>

        <section className="upload-card">
          <div className="upload-dropzone">
            {preview ? (
              <img
                src={preview}
                alt="Selected image preview"
                className="upload-preview"
              />
            ) : (
              <>
                <div className="upload-icon">✳</div>
                <h2>Choose your moment</h2>
                <p>Your photo will appear here once selected.</p>
              </>
            )}

            <FileUpload onFileSelect={handleFileSelect} />

            {file && <p>{file.name}</p>}
          </div>

          <div className="caption-section">
            <label htmlFor="caption">Caption</label>

            <textarea
              id="caption"
              placeholder="What's the story behind this moment?"
              maxLength={500}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {message && <p className="upload-message">{message}</p>}

          <div className="upload-footer">
            <button
              type="button"
              className="publish-btn"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish post"}
              {!loading && <span>→</span>}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Upload;
