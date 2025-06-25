import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [name, setName] = useState("");
    const [num_rounds, setNumRounds] = useState(1);
    const [year, setYear] = useState(2025);
    const[teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState(null);
    const [error, setError] = useState("");

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

    const handle_start_draft = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await axios.post("http://localhost:8000/mock_drafts", {
                name: name || "Mock Draft",
                num_rounds: num_rounds,
                year: year
            });
            const createdDraft = result.data;

            for (const teamId of selectedTeams) {
                await axios.post("http://localhost:8000/user_controlled_teams", {
                    mock_draft_id: createdDraft.id,
                    team_id: teamId
                });
            }

            setDraft(createdDraft);
        } catch (err) {
            setError("Failed to create mock draft.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h1>NFL Mock Draft Simulator</h1>

            <div className="mock_draft_settings">
                <h2>Mock Draft Settings</h2>

                <div class="name_settings">
                    <label>
                        Draft Name 
                        <input id="name_input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mock Draft"/>
                    </label>
                </div>
                

                <div class="year_settings">
                    <label>
                        Year 
                        <select id="year_select" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                            <option value={2025}>2025</option>
                        </select>
                    </label>
                </div>
                

                <div class="num_rounds_settings">
                    <label id="num_rounds_label"># of Rounds</label>
                    {[1, 2, 3, 4, 5, 6, 7].map((round) => (
                        <button class="num_rounds_buttons" key={round} onClick={() => setNumRounds(round)} style={{
                            backgroundColor: num_rounds === round ? "#003049" : "#eee", color: num_rounds === round ? "#fff" : "#000"
                        }}>{round}</button>
                    ))}
                </div>

                <h3>Select Teams You Want to Control</h3>
                <button id="select_all_button" onClick={handleSelectAll}>
                    {selectedTeams.length === teams.length ? "Deselect All" : "Select All"}
                </button>

                <div class="select_teams_grid">
                    {teams.map((team) => (
                        <button class="select_team_buttons" key={team.id} onClick={() => handleToggleTeam(team.id)} style={{ backgroundColor: selectedTeams.includes(team.id) ? "#003049" : "#eee", color: selectedTeams.includes(team.id) ? "#fff" : "#000"}}>
                            {team.name}
                        </button>
                    ))}
                </div>

                <button id="start_draft_button" onClick={handle_start_draft} disabled={loading || selectedTeams.length === 0}>
                    {loading ? "Creating..." : "Start Draft"}
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {draft && <p>Draft created! ID: {draft.id}, Name: {draft.name}</p>}
            </div>

            <div class="mock_draft_instructions">
                <h2>Mock Draft Instructions</h2>

                <ul>
                    <li>Select your preferred draft settings on the left sidebar</li>
                    <li>Pick the teams you want to control</li>
                    <li>Simulate each pick round-by-round</li>
                    <li>Make the picks for your teams</li>
                </ul>

                <h3>Ready to draft?</h3>
                <p>Click "Start Draft" to begin your personalized NFL mock draft experience.</p>
            </div>
        </div>
    );
}

export default Home;