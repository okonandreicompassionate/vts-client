import { Route, Routes } from "react-router-dom";
import "./App.css";
import AboutPage from "./features/AboutPage";
import ContactPage from "./features/ContactPage";
import HomePage from "./features/HomePage";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
  );
}

export default App;
