import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import UploadCSV from "./pages/csv";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadCSV />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App