import { Route, Routes } from "react-router-dom";
import "./App.css";
import Registration from "./features/Registration";
import ContactPage from "./features/VerifyIdentity";
;

function App() {
  return (
    <main>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
  );
}

export default App;
