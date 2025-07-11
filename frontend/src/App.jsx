import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import Results from "./pages/Results";
import TeamView from "./pages/TeamView";
import PlayerProfile from "./pages/PlayerProfile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft/:draftId" element={<Draft />} />
        <Route path="/results/:draftId" element={<Results />} />
        <Route path="/team/:teamId" element={<TeamView />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;