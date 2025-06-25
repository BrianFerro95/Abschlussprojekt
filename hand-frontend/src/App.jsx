// client/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Exchange from "./pages/Exchange/Exchange.jsx"; // Importiere die Exchange-Komponente
import Help from "./pages/Help";

function App() {
  return (
    <Router>
      <Navbar />{" "}
      {/* Die Navbar wird immer angezeigt, unabhängig von der Route */}
      <div className="container">
        {" "}
        {/* Optional: Ein Container für deinen Seiteninhalt */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register onSuccess={(data) => {alert("Registrierung erfolgreich!");navigate('/login');}}/>}/>
          <Route path="/help" element={<Help />} />
          <Route path="/events" />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange/*" element={<Exchange />} />{" "}
          {/* exchange beinhaltet: Verschenke, Tauschen, Suchen */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
