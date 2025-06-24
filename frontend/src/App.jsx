import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import TeamView from "./pages/TeamView";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/team/:teamId" element={<TeamView />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;