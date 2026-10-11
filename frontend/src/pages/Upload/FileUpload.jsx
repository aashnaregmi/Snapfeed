// FileUpload.jsx

import { useRef } from "react";

function FileUpload({ onFileSelect }) {
  const fileInput = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      onFileSelect(file);
    }

    e.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInput}
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleChange}
      />

      <button
        type="button"
        className="choose-image-btn"
        onClick={() => fileInput.current.click()}
      >
        Select from device
      </button>

      <span className="upload-hint">JPG, PNG or WEBP</span>
    </div>
  );
}

export default FileUpload;
