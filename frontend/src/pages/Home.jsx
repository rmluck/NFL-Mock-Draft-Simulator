import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const [name, setName] = useState("");
    const [numRounds, setNumRounds] = useState(1);
    const [year, setYear] = useState(2025);
    const[teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:8000/teams/");
                setTeams(response.data);
            } catch (err) {
                console.error("Failed to fetch teams");
            }
        };
        fetchTeams();
    }, []);

    const handleToggleTeam = (teamId) => {
        setSelectedTeams((prev) => prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]);
    };

    const handleSelectAll = () => {
        if (selectedTeams.length === teams.length) {
            setSelectedTeams([]);
        } else {
            setSelectedTeams(teams.map((team) => team.id));
        }
    };

    const handleStartDraft = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await axios.post("http://localhost:8000/mock_drafts", {
                name: name || "Mock Draft",
                num_rounds: numRounds,
                year: year
            });
            const createdDraft = result.data;

            for (const teamId of selectedTeams) {
                await axios.post("http://localhost:8000/user_controlled_teams", {
                    mock_draft_id: createdDraft.id,
                    team_id: teamId
                });
            }

            navigate(`/draft/${createdDraft.id}`, { state: { createdDraft } });
        } catch (err) {
            setError("Failed to create mock draft.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home_container">
            <header className="home_header">
                <img src="/site/main_logo.png" alt="NFL Mock Draft Simulator logo" id="main_logo" />
            </header>

            <main className="home_main">
                <aside className="mock_draft_settings">
                    <h2>Mock Draft Settings</h2>

                    <p className="mock_draft_instructions">
                        1. Select preferred draft settings
                        <br />
                        2. Pick teams to control as user
                        <br />
                        3. Simulate each draft pick
                    </p>
                    <br />

                    <label className="draft_name">
                        Draft Name
                        <br />
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mock Draft" />
                    </label>

                    <label className="draft_year">
                        Year
                        <br />
                        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                            <option value={2025}>2025</option>
                        </select>
                    </label>
                    <br />

                    <label className="num_rounds">
                        Number of Rounds
                        <div className="num_rounds_selector">
                            {[1, 2, 3, 4, 5, 6, 7].map((round) => (
                                <button key={round} className={numRounds === round ? "selected" : ""} onClick={() => setNumRounds(round)}>
                                    {round}
                                </button>
                            ))}
                        </div>
                    </label>
                    <br />

                    <button id="start_btn" onClick={handleStartDraft} disabled={loading}>
                        {loading ? "Creating..." : "Start Draft"}
                    </button>

                    {error && <p className="error">{error}</p>}
                </aside>

                <section className="team_selection">
                    <div className="teams_grid_header">
                        <h2>Select Teams to Control</h2>
                        <button onClick={handleSelectAll} id="select_all_btn">
                            {selectedTeams.length === teams.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <div className="teams_grid">
                        {teams.map((team) => (
                            <button key={team.id} onClick={() => handleToggleTeam(team.id)} className={`team_btn ${selectedTeams.includes(team.id) ? "selected" : ""}`}>
                                <div className="team_logo_wrapper">
                                    <img src={`/logos/nfl/${team.name}.png`} alt={`${team.name} logo`} className="team_logo" />
                                </div>
                                <span className="team_name">{team.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;