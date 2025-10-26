/*
  * Main App component. Sets up main application routes using React Router.
*/


// Import necessary libraries and components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import Results from "./pages/Results";
import "./App.css";

// Function to set up the main application routes
function App() {
  useEffect(() => {
    // Preload critical data to wake up backend server
    const preloadData = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

        // Ping health endpoint to wake up server
        await axios.get(`${apiURL}/health`, { timeout: 30000 });

        // Preload teams data
        await axios.get(`${apiURL}/teams/`, { timeout: 30000 });

        console.log("Backend preloaded successfully");
      } catch (error) {
        console.log("Preload failed (this is normal on first visit):", error.message);
      }
    }

    preloadData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft/:draftId" element={<Draft />} />
        <Route path="/results/:draftId" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;