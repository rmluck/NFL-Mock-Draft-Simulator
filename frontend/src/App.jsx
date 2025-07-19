/*
  * Main App component. Sets up main application routes using React Router.
*/


// Import necessary libraries and components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import Results from "./pages/Results";
import "./App.css";

// Function to set up the main application routes
function App() {
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