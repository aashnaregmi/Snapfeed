import { useState } from "react";
import "./App.css";

import Upload from "./pages/Upload";
import Feed from "./pages/Feed";

function App() {
  const [page, setPage] = useState("upload");

  return (
    <div>
      {page === "upload" && <Upload goToFeed={() => setPage("feed")} />}

      {page === "feed" && <Feed goToUpload={() => setPage("upload")} />}
    </div>
  );
}

export default App;
