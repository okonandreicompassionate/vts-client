import { Routes, Route } from "react-router-dom";
import AdminLogin from "./features/AdminLogin.tsx";
import AdminDashboard from "./features/AdminDashboard";
import VisitorPage from "./features/VisitorPage";
import VisitorDetails from "./features/VisitorDetails.tsx";
import VisitorReview from "./features/VisitorReview.tsx";
import AdminSettings from "./features/AdminSettings.tsx";

import "./App.css";
import { PopupProvider } from "./contexts/PopupProvider.tsx";

function App() {
  return (
    <PopupProvider>
      <main>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/visitorpage" element={<VisitorPage />} />
          <Route path="/visitordetails" element={<VisitorDetails />} />
          <Route path="/visitorreview" element={<VisitorReview />} />
          <Route path="/adminsettings" element={<AdminSettings />} />
        </Routes>
      </main>
    </PopupProvider>
  );
}

export default App;
