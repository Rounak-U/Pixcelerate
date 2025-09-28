// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import Process from "./pages/Process";
import Metrics from "./pages/Metrics";

function App() {
  const [images, setImages] = useState([]); // shared state

  return (
    <Router>
      <Navbar />
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Upload images={images} setImages={setImages} />} />
          <Route path="/gallery" element={<Gallery images={images} setImages={setImages} />} />

         <Route path="/process" element={<Process images={images} />} />
          <Route path="/metrics" element={<Metrics />} />
         

        </Routes>
      </main>
    </Router>
  );
}

export default App;
