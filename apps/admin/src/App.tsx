import { Routes,Route } from "react-router-dom";
import AdminLogin from "./features/AdminLogin.tsx";
import AdminDashboard from "./features/AdminDashboard";
import VisitorPage from "./features/VisitorPage";
import VisitorDetails from "./features/VisitorDetails.tsx";
import VisitorReview from "./features/VisitorReview.tsx";

import "./App.css";

function App() {
  return (
    <main>
        <Routes>
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/visitorpage" element={<VisitorPage/>} />
        <Route path="/visitordetails" element={<VisitorDetails/>} />
        <Route path="/visitorreview" element={<VisitorReview/>} />
        
      </Routes>
    </main>
  );
}

export default App;
