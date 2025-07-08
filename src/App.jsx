import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import './index.css'
import CarDetailPage from "./pages/CarDetailPage";
import CarPage from "./pages/CarPage";
import HowAutoSaleWork from "./pages/HowAutoSaleWork";
import CarReview from "./pages/CarReview";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./components/context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarPage />} />
          <Route path="/how-auto-works" element={<HowAutoSaleWork />} />
          <Route path="/customer-reviews" element={<CarReview />} />
          <Route path="/cars/:carId" element={<CarDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;