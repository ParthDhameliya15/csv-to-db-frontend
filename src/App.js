import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import UploadCSV from "./pages/csv";
import ModifiedTime from "./pages/time";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadCSV />} />
        <Route path="/file_modified_time" element={<ModifiedTime/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App