import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "../features/registration/components/Registration";
import VerifyIdentity from "../features/verify-identity/components/VerifyIdentity";
import LandingPage from "./routes/landing";

export function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                 <Route path="/" element={<LandingPage/>}></Route>
                <Route path="/register" element={<Registration/>}></Route>
                <Route path="/verify" element={<VerifyIdentity/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}