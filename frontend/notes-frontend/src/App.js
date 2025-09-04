// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SharedNote from "./components/SharedNote";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/share/:slug" element={<SharedNote />} />
      </Routes>
    </Router>
  );
}

export default App;
